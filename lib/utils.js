const fs = require('fs')

exports.range = function range (start, end) {
  const res = []
  for (let index = start; index < end; index++) {
    res.push(index)
  }
  return res
}

exports.sleep = function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

exports.writeJson = function writeJson (obj, fileName) {
  fs.writeFileSync(fileName, JSON.stringify(obj, null, 2), 'utf8')
}

exports.readJson = function readJson (fileName) {
  return JSON.parse(fs.readFileSync(fileName, 'utf8'))
}
