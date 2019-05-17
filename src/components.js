const h = require('hastscript')
const casex = require('casex')
const { findAllHastnodes, handlify, textValue, VNode } = require('./utils')

// ...

const headerTags = ['h2', 'h3', 'h4', 'h5', 'h6']

exports.sitetree = function(files) {
  
  let root = new VNode('')
  
  // console.log(files)
  
  for (let file of files) {
    root.addChild(new VNode(file.outFile, {
      href: file.outFile
    }))
  }
  
  let list = h('nav.sitetree.menu')
  
  root.map(list, (node, previous) => {
    let elem
  
    if (node.value) {
      let { href, title } = node.value
      elem = h('li', h('a', { href }, title || href))
    } else {
      previous.children.push(
        h('p.menu-label', casex(node.name, 'Ca Se'))
      )
      elem = h('ul.menu-list')
    }
    
    previous.children.push(elem)
  
    return elem
  })
  
  return list
}

exports.pagetree = function(node, file) {
  let headingElems = findAllHastnodes(node, n => headerTags.includes(n.tagName))

  if (headingElems.length === 0) return null
  
  const headings = headingElems.map(elem => {
    let title = textValue(elem)
    
    return {
      title: title,
      handle: handlify(title),
      level: parseInt(elem.tagName.slice(1), 10)
    }
  })

  return h('nav.pagetree.content', [
    headings.map(
      heading => h(`li.level-${heading.level}`, [
        h('a', { href: `#${heading.handle}`}, heading.title)
      ])
    )
  ])
}
