//
// General utilities to be used across the project
//

const fs = require('fs')
const { promisify } = require('util')
const { basename, join } = require('path')

const casex = require('casex')
const Sass = require('sass')
const Fiber = require('fibers')
const ms = require('ms')

exports.writeFile = promisify(fs.writeFile)
exports.readFile = promisify(fs.readFile)
exports.mkdir = promisify(fs.mkdir)

exports.ensureDir = function(path) {
  let stats

  try {
    stats = fs.statSync(path)
  } catch (error) {
    return exports.mkdir(path, { recursive: true })
  }

  if (!stats || !stats.isDirectory()) {
    throw new Error(`'${path}' exists and isn't a directory`)
  }
}

exports.findHastnode = function(node, predicate) {
  if (!node.children) return null
  for (let child of node.children) {
    if (predicate(child)) return child

    const nested = exports.findHastnode(child, predicate)
    if (nested) return nested
  }
  return null
}

exports.findAllHastnodes = function(node, predicate, result = []) {
  if (!node.children) return result

  for (let child of node.children) {
    if (predicate(child)) result.push(child)

    result.push(...exports.findAllHastnodes(child, predicate))
  }

  return result
}

exports.handlify = function(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

exports.textValue = function(elem) {
  return elem.children.map(n => (n.type === 'text' ? n.value : '')).join('')
}

exports.trimSlashes = str => str.replace(/^\/+/, '').replace(/\/+$/, '')

exports.VNode = class {
  constructor(name, value) {
    this.name = name
    this.children = []
    this.value = value

    Object.defineProperty(this, 'parent', {
      value: null,
      writable: true,
      enumerable: false
    })
  }
  addChild(child) {
    let segments = exports
      .trimSlashes(child.name)
      .split('/')
      .filter(str => str !== '')

    if (segments.length === 0) {
      throw new Error(`Invaid VNode '${child.name}'`)
    }

    let parent = this
    child.name = segments.pop()

    for (let segment of segments) {
      let newParent = parent.children.find(n => n.name === segment)
      if (!newParent) {
        newParent = new exports.VNode(segment)
        parent.children.push(newParent)
        newParent.parent = parent
      }
      parent = newParent
    }

    parent.children.push(child)
    child.parent = parent
  }

  sort(comparator) {
    this.children.sort(comparator)

    for (let child of this.children) {
      child.sort(comparator)
    }
  }

  map(lambda) {
    let childResults = []
    for (let child of this.children) {
      childResults.push(child.map(lambda))
    }

    return lambda(this, childResults)
  }
}

exports.generatePageName = function(file) {
  return (
    file.data.title ||
    casex(basename(file.outFile).replace('.html', ''), 'Ca Se')
  )
}

exports.renderSass = async function(inputFile, primary, primaryInvert) {
  let contents = await exports.readFile(inputFile, 'utf8')
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

exports.timeLamda = async function(block) {
  let startTime = Date.now()
  await block()
  return Date.now() - startTime
}

exports.StopWatch = class {
  constructor(title) {
    this.title = title
    this.startedAt = Date.now()
    this.timeseries = []
  }

  record(title) {
    this.timeseries.push({ title, time: Date.now() })
  }

  output() {
    console.log(`StopWatch: ${this.title}`)

    let currentTime = this.startedAt

    for (let item of this.timeseries) {
      console.log(`- ${ms(item.time - currentTime)} ${item.title}`)
      currentTime = item.time
    }

    console.log(`Total time: ${ms(currentTime - this.startedAt)}`)
  }
}

exports.generateOutputPath = function(inputPath, indexFile) {
  let parts = inputPath.split('/')

  for (let i in parts) {
    parts[i] = parts[i].replace(/^\d+-/, '')
  }

  return parts
    .join('/')
    .replace(new RegExp(`${indexFile}\\.md$`), 'index.md')
    .replace(/\.md$/, '.html')
}

exports.generateOutputHref = function(outputPath) {
  return outputPath.replace(/\.html$/, '').replace(/index$/, '/')
}

exports.WikiFile = class {
  constructor(inputFile, outFile, data, contents) {
    this.inputFile = inputFile
    this.outFile = outFile
    this.data = data
    this.contents = contents
    this.html = ''
  }
}
