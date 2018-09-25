module.exports = {
  command: 'costOrc <command>',
  aliases: ['co'],
  desc: '造价pdf => excel工具',
  builder: yargs => yargs.commandDir('costOrcCmds')
}
