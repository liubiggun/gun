const subCmd = require('path').basename(__filename, '.js')
const { execSync } = require('child_process')

module.exports = {
  command: `${subCmd} <target> <dest>`,
  aliases: [],
  desc: '',
  builder: {
    target: {
      alias: 't',
      type: 'string',
      desc: '目标文件或目标目录'
    },
    dest: {
      alias: 'd',
      type: 'string',
      desc: '目标目录'
    }
  },
  handler: argv => {
    const { target, dest } = argv
    switch(true) {
      case /.+\.tar\.bz2$/.test(dest):
        execSync(`tar -jcvf ${dest} ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tar\.gz$/.test(dest):
        execSync(`tar -zcvf ${dest} ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tar$/.test(dest):
        execSync(`tar -cvf ${dest} ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tbz2$/.test(dest):
        execSync(`tar -jcvf ${dest} ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tgz$/.test(dest):
        execSync(`tar -zcvf ${dest} ${target}`, {
          stdio: 'inherit'
        })
        break
      default:
        console.log('没有该文件类型的处理方法')
        break
    }
  }
}
