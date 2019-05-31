//
// HTML components ~ reusable blocks for rendering
//

const { join } = require('path')

const h = require('hastscript')
const casex = require('casex')
const hastQuery = require('hast-util-select')
const hastToText = require('hast-util-to-text')
const {
  handlify,
  VNode,
  generatePageName,
  generateOutputHref
} = require('./utils')

exports.sitetree = function(files, basePath = '/') {
  let root = new VNode('pages')

  for (let file of files) {
    root.addChild(
      new VNode(file.outFile, {
        title: generatePageName(file),
        href: generateOutputHref(file.outFile),
        file: file
      })
    )
  }

  const nameNode = node => (node.value ? node.value.file.inputFile : node.name)
  root.sort((a, b) => nameNode(a) > nameNode(b))

  let menu = root.map((node, childResults) => {
    if (node.value) {
      const attrs = {
        href: join(basePath, node.value.href)
      }

      return h('li', [h(`a`, attrs, node.value.title)])
    } else {
      return h('li', [
        h('p.menu-label', casex(node.name, 'Ca Se')),
        h('ul.menu-list', childResults)
      ])
    }
  })

  return h('nav.sitetree.menu', menu.children)
}

exports.pagetree = function(contentNode) {
  // console.log(contentNode.children)
  // let headingElems = contentNode.children.filter(
  //   contentNode, n => headerTags.includes(n.tagName)
  // )

  let headingNodes = hastQuery.selectAll('h2,h3,h4,h5,h6', contentNode)

  if (headingNodes.length === 0) return null

  const headings = headingNodes.map(headingNode => {
    let title = hastToText(headingNode)

    return {
      title: title,
      handle: handlify(title),
      level: parseInt(headingNode.tagName.slice(1), 10)
    }
  })

  return h('nav.pagetree', [
    h(
      'ol',
      headings.map(heading =>
        h(`li.level-${heading.level}`, [
          h('a', { href: `#${heading.handle}` }, heading.title)
        ])
      )
    )
  ])
}
