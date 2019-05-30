const { join } = require('path')
const { promisify } = require('util')
const { readFile } = require('./promisified')

const Sass = require('sass')
const Fiber = require('fibers')

exports.renderSass = async function(inputFile, primary, primaryInvert) {
  let contents = await readFile(inputFile, 'utf8')
  let variables = `$primary: ${primary}\n$primary-invert: ${primaryInvert}\n`

  const options = {
    data: variables + contents,
    indentedSyntax: true,
    includePaths: [join(__dirname, '../node_modules')],
    outputStyle: 'compressed',
    fiber: Fiber
  }

  return promisify(Sass.render)(options)
}
