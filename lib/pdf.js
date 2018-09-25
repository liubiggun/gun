const { PDFImage } = require('pdf-image')
const { range } = require('./utils')

exports.pdf2Image = async function (filePath, page, options = {}) {
  const res = []
  const pdfImage = new PDFImage(filePath, options)
  for (const i of range(0, page)) {
    const image = await pdfImage.convertFile(i)
    res.push(await pdfImage.convertFile(i))
  }
  return res
}
