//
// General utilities to be used across the project
//

const { basename } = require('path')

const casex = require('casex')

// const { readFile, writeFile, mkdir } = require('./promisified')

// const { findHastNode, findAllHastNodes } = require('./hast')
// const { VNode } = require('./v-node')
// const { StopWatch } = require('./stop-watch')
// const { WikiFile } = require('./wiki-file')
// const { renderSass } = require('./sass')

module.exports = {
  ...require('./paths'),
  ...require('./promisified'),
  ...require('./hast'),
  ...require('./v-node'),
  ...require('./stop-watch'),
  ...require('./wiki-file'),
  ...require('./sass'),
  ...require('./files')
}

//
// Move to WikiFile ?
//
module.exports.generatePageName = function(file) {
  return (
    file.data.title ||
    casex(basename(file.outFile).replace('.html', ''), 'Ca Se')
  )
}

module.exports.generateOutputPath = function(inputPath, indexFile) {
  let parts = inputPath.split('/')

  for (let i in parts) {
    parts[i] = parts[i].replace(/^\d+-/, '')
  }

  return parts
    .join('/')
    .replace(new RegExp(`${indexFile}\\.md$`), 'index.md')
    .replace(/\.md$/, '.html')
}

module.exports.generateOutputHref = function(outputPath) {
  return outputPath.replace(/\.html$/, '').replace(/index$/, '/')
}
