//
// General utilities to be used across the project
//

const { basename } = require('path')

const casex = require('casex')
const h = require('hastscript')

// Move to WikiFile ?
function generatePageName(file) {
  return (
    file.data.title ||
    casex(basename(file.outFile).replace('.html', ''), 'Ca Se')
  )
}

// Move to WikiFile ?
function generateOutputPath(inputPath, indexFile) {
  let parts = inputPath.split('/')

  for (let i in parts) {
    parts[i] = parts[i].replace(/^\d+-/, '')
  }

  return parts
    .join('/')
    .replace(new RegExp(`${indexFile}\\.md$`), 'index.md')
    .replace(/\.md$/, '.html')
}

// Move to WikiFile ?
function generateOutputHref(outputPath) {
  return outputPath.replace(/\.html$/, '').replace(/index$/, '/')
}

/** Wrap any <table> elemenets in an array with a wrapper */
function wrapTables(node) {
  for (let i in node.children) {
    if (node.children[i].tagName !== 'table') continue
    node.children[i] = h('.overflow-wrapper', [node.children[i]])
  }
}

module.exports = {
  ...require('./paths'),
  ...require('./promisified'),
  ...require('./hast'),
  ...require('./v-node'),
  ...require('./stop-watch'),
  ...require('./wiki-file'),
  ...require('./sass'),
  ...require('./files'),
  generatePageName,
  generateOutputPath,
  generateOutputHref,
  wrapTables
}
