module.exports = {
  command: 'util <command>',
  aliases: [],
  desc: '工具',
  builder: yargs => yargs.commandDir('utilCmds')
}
