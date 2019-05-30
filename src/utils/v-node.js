const { trimSlashes } = require('./paths')

class VNode {
  constructor(name, value = null) {
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
        newParent = new VNode(segment)
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

module.exports = { VNode }
