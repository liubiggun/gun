#!/usr/bin/env node

const path = require('path')

require('yargs')
  .commandDir(path.resolve(__dirname, 'src'), {
    exclude: /index\.js$/
  })
  .demandCommand()
  .help()
  .alias('h', 'help')
  .epilog('gun cli')
  .argv
