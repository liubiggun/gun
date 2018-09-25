const subCmd = require('path').basename(__filename, '.js')
const { execSync } = require('child_process')

module.exports = {
  command: `${subCmd} <target> [dest]`,
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
      desc: '目标目录',
      default: '.'
    }
  },
  handler: argv => {
    const { target, dest = '.' } = argv
    switch(true) {
      case /.+\.tar\.bz2$/.test(target):
        execSync(`tar -jxvf ${target} -C ${dest}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tar\.gz$/.test(target):
        execSync(`tar -zxvf ${target} -C ${dest}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.bz2$/.test(target):
        execSync(`bunzip2 ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.rar$/.test(target):
        execSync(`unrar x ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.gz$/.test(target):
        execSync(`gunzip ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tar$/.test(target):
        execSync(`tar -xvf ${target} -C ${dest}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tbz2$/.test(target):
        execSync(`tar -jxvf ${target} -C ${dest}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.tgz$/.test(target):
        execSync(`tar -zxvf ${target} -C ${dest}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.zip$/.test(target):
        execSync(`unzip ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.Z$/.test(target):
        execSync(`uncompress ${target}`, {
          stdio: 'inherit'
        })
        break
      case /.+\.7z$/.test(target):
        execSync(`7z x ${target}`, {
          stdio: 'inherit'
        })
        break
      default:
        console.log('没有该文件类型的处理方法')
        break
    }
  }
}
