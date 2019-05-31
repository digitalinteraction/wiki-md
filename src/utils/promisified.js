const fs = require('fs')
const glob = require('glob')
const sass = require('sass')
const { promisify } = require('util')

module.exports = {
  writeFile: promisify(fs.writeFile),
  readFile: promisify(fs.readFile),
  mkdir: promisify(fs.mkdir),
  renderSass: promisify(sass.render),
  glob: promisify(glob)
}
