//
// This file has plugins for unified, each acts on different stages of the pipeline
//

const h = require('hastscript')
const hastQuery = require('hast-util-select')
const hastToText = require('hast-util-to-text')

const npmPackage = require('../package.json')
const { handlify, generatePageName, wrapTables } = require('./utils')
const component = require('./components')

const injectPageStructure = options => (node, file) => {
  const { siteTitle, ownerLink, ownerName, basePath, sitetree } = options

  wrapTables(node)

  const pageContents = [h('.content', node.children)]

  const pagetree = component.pagetree(node, file)

  if (sitetree) pageContents.unshift(sitetree)
  if (pagetree) pageContents.push(pagetree)

  if (sitetree) {
    let anchors = hastQuery.selectAll('a', sitetree)

    for (let anchor of anchors) {
      anchor.properties.className = anchor.properties.className || []
      anchor.properties.className.push(
        anchor.properties.href === file.outFile ? 'is-active' : ''
      )
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

const identifyTitles = () => node => {
  let headings = hastQuery.selectAll('h1,h2,h3,h4,h5,h6', node)

  for (let elem of headings) {
    elem.properties.id = handlify(hastToText(elem))
  }
}

const updateDocumentTitle = ({ siteTitle = 'Wiki' }) => (node, file) => {
  const titleElem = hastQuery.select('title', node)

  let pageTitle = generatePageName(file)

  if (titleElem && titleElem.children[0]) {
    titleElem.children[0].value = `${pageTitle} | ${siteTitle}`
  }
}

module.exports = { injectPageStructure, identifyTitles, updateDocumentTitle }
