const { basename } = require('path')
const casex = require('casex')

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

const trimSlashes = str => str.replace(/^\/+/, '').replace(/\/+$/, '')

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
    let segments = trimSlashes(child.name)
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

  map(lambda) {
    let childResults = []
    for (let child of this.children) {
      childResults.push(child.map(lambda))
    }

    return lambda(this, childResults)
  }
}

exports.namePage = function(file) {
  return (
    file.data.title ||
    casex(basename(file.outFile).replace('.html', ''), 'Ca Se')
  )
}
