const { join } = require('path')
const { readFile, renderSass } = require('./promisified')

const Fiber = require('fibers')

async function generateCss(inputFile, primary, primaryInvert) {
  let contents = await readFile(inputFile, 'utf8')
  let variables = `$primary: ${primary}\n$primary-invert: ${primaryInvert}\n`

  const options = {
    data: variables + contents,
    indentedSyntax: true,
    includePaths: [join(__dirname, '../../node_modules')],
    outputStyle: 'compressed',
    fiber: Fiber
  }

  return renderSass(options)
}

module.exports = { generateCss }
