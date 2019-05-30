//
// This file has plugins for unified, each acts on different stages of the pipeline
//

const h = require('hastscript')

const npmPackage = require('../package.json')
const {
  findHastNode,
  findAllHastNodes,
  handlify,
  textValue,
  generatePageName
} = require('./utils')
const component = require('./components')

// Wrap any <table> elemenets in an array with a wrapper
function wrapTables(children, predicate) {
  for (let i in children) {
    if (children[i].tagName !== 'table') continue
    children[i] = h('.overflow-wrapper', [children[i]])
  }
}

exports.injectPageStructure = options => (node, file) => {
  const { siteTitle, ownerLink, ownerName, basePath, sitetree } = options

  wrapTables(node.children)

  const pageContents = [h('.content', node.children)]

  const pagetree = component.pagetree(node, file)

  if (sitetree) pageContents.unshift(sitetree)
  if (pagetree) pageContents.push(pagetree)

  if (sitetree) {
    let anchors = findAllHastNodes(sitetree, elem => elem.tagName === 'a')

    for (let anchor of anchors) {
      anchor.properties.class =
        anchor.properties.href === file.outFile ? 'is-active' : ''
    }
  }

  node.children = [
    h('nav.navbar.is-primary.has-shadow', [
      h('.container', [
        h('.navbar-brand', [
          h('a.navbar-item', { href: basePath }, siteTitle),
          h('a.navbar-burger burger', [h('span'), h('span'), h('span')])
        ])
      ])
    ]),
    h('main', [
      h('section.section', [
        h('.container', [h('.page-wrapper', pageContents)])
      ])
    ]),
    h('.modal', [
      h('.modal-background'),
      h('.modal-content', h('.box')),
      h('button.modal-close.is-large', { 'aria-label': 'close' })
    ]),
    h('footer.footer', [
      h('.container', [
        h('p', [
          'Made by ',
          h('a', { href: ownerLink }, ownerName),
          ` – built with ${npmPackage.name}:${npmPackage.version}`
        ])
      ])
    ])
  ]
}

exports.identifyTitles = () => (node, file) => {
  let headings = findAllHastNodes(node, n => /^h\d$/.test(n.tagName))

  for (let elem of headings) {
    elem.properties.id = handlify(textValue(elem))
  }
}

exports.updateDocumentTitle = ({ siteTitle = 'Wiki' }) => (node, file) => {
  const titleElem = findHastNode(node, n => n.tagName === 'title')

  let pageTitle = generatePageName(file)

  if (titleElem && titleElem.children[0]) {
    titleElem.children[0].value = `${pageTitle} | ${siteTitle}`
  }
}

exports.addBaseTag = ({ basePath }) => (node, filename) => {
  const headElem = findHastNode(node, n => n.tagName === 'head')

  if (!headElem) return

  headElem.children.push(h('base', { href: basePath }))
}
