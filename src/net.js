module.exports = {
  command: 'net <command>',
  aliases: [],
  desc: '网络工具',
  builder: yargs => yargs.commandDir('netCmds')
}
