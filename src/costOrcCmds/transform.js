const subCmd = require('path').basename(__filename, '.js')
const path = require('path')
const { pdf2Image } = require('../../lib/pdf')
const { client } = require('../../lib/aip')
const { wget } = require('../../lib/curl')
const { sleep, writeJson, readJson } = require('../../lib/utils')
const fs = require('fs')
const moment = require('moment')
const mkdirp = require('mkdirp')

module.exports = {
  command: `${subCmd} <dir> [dest]`,
  aliases: ['tra', 'do'],
  desc: 'pdf => excel',
  builder: {
    dir: {
      alias: 'f',
      type: 'string',
      desc: '目录地址'
    },
    dest: {
      alias: 'd',
      type: 'string',
      desc: '目标目录',
      default: '.'
    },
    page: {
      alias: 'p',
      type: 'number',
      desc: 'pdf页数',
      default: 57
    }
  },
  handler: async argv => {
    const { dir: dirString, page } = argv
    const dir = path.resolve(dirString)
    const resultDir = path.join(dir, 'result')
    const files = fs.readdirSync(dir)
      .filter(file => path.extname(file).toLowerCase() === '.pdf')
      .map(file => path.join(dir, file))
    const existImages = fs.readdirSync(dir)
      .filter(file => path.extname(file).toLowerCase() === '.png')
      .map(file => path.join(dir, file))

    const theTask = {
      files,
      images: [],
      requestMap: {}
    }

    try {
      const file = files[0]
      console.log('pdf => image')
      let images = existImages.length ? existImages : await pdf2Image(file, page, {
        convertOptions: {
          '-density': 300,
          '-trim': '',
          '-flatten': '',
          '-quality': 100
        }
      })
      images = images.sort((a, b) => {
        function getPage (name) {
          return path.basename(name).replace(new RegExp(`^\.+-(\\d+)\.png$`), '$1')
        }
        return getPage(a) - getPage(b)
      })
      theTask.images = images
      console.log(`images:\n${images.join('\n')}`)

      if (!fs.existsSync(resultDir)) {
        console.log(`创建目录: ${resultDir}`)
        mkdirp.sync(resultDir)
      }

      for (const fileName of images) {
        const targetFileName = path.basename(fileName).replace(/^(.+).png$/, '$1.xls')
        const targetFile = path.join(dir, 'result', targetFileName)

        console.log(`
        开始处理${fileName}
        ---------------------------------------------------------
        `)

        if (fs.existsSync(targetFile)) {
          console.log(`${targetFile}已存在，跳过处理`)
          continue
        }

        const image = fs.readFileSync(fileName).toString('base64')

        // 调用表格文字识别
        const beginRes = await client.tableBegin(image)
        const requestId = beginRes.result[0].request_id
        theTask.requestMap[fileName] = requestId
        console.log(`${path.basename(fileName)} 请求ID: ${requestId}`)

        // 获取表格识别结果
        let result
        do {
          await sleep(1000)
          result = await client.tableGetresult(requestId, {
            result_type: 'excel'
          })
        } while (result.result.ret_msg !== '已完成')

        const { result: { result_data: resultUrl } } = result
        console.log(`下载地址：${resultUrl}`)

        await wget(resultUrl, fileName.replace(/^(.+).png$/, targetFile))
        console.log(`下载成功：${targetFile}`)
      }

      saveTask(dir, theTask)
    } catch (err) {
      saveTask(dir, theTask)
      console.error(err)
    }
  }
}

function saveTask (dir, theTask) {
  const theTaskFile = path.join(dir, `task-${moment().format('YYYY-MM-DD-HH-mm-ss')}.json`)
  const taskFile = path.join(dir, `task.json`)

  writeJson(theTask, theTaskFile)

  const allTaskFiles = fs.readdirSync(dir)
    .filter(file => /task-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}\.json/.test(file))
    .map(file => path.join(dir, file))

  const requestMap = {}
  allTaskFiles.forEach(file => {
    const json = readJson(file)
    Object.assign(requestMap, json.requestMap)
  })

  writeJson({
    requestMap
  }, taskFile)
}
