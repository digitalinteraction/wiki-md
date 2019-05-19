const h = require('hastscript')
const casex = require('casex')
const { basename, extname } = require('path')

const npmPackage = require('../package.json')
const {
  findHastnode,
  findAllHastnodes,
  handlify,
  textValue,
  namePage
} = require('./utils')
const component = require('./components')

exports.injectPageStructure = options => (node, file) => {
  const { siteTitle, ownerLink, ownerName, basePath, files } = options

  const pageContents = [h('.content', node.children)]

  const sitetree = component.sitetree(file, files)
  const pagetree = component.pagetree(node, file)

  if (sitetree) pageContents.unshift(sitetree)
  if (pagetree) pageContents.push(pagetree)

  // <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
  //   <span aria-hidden="true"></span>
  //   <span aria-hidden="true"></span>
  //   <span aria-hidden="true"></span>
  // </a>

  node.children = [
    h('nav.navbar.is-primary.has-shadow', [
      h('.container', [
        h('.navbar-brand', [
          h('a.navbar-item', { href: basePath }, siteTitle),
          h('button.navbar-burger burger', [h('span'), h('span'), h('span')])
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
  let headings = findAllHastnodes(node, n => /^h\d$/.test(n.tagName))

  for (let elem of headings) {
    elem.properties.id = handlify(textValue(elem))
  }
}

exports.updateDocumentTitle = ({ siteTitle = 'Wiki' }) => (node, file) => {
  const titleElem = findHastnode(node, n => n.tagName === 'title')

  let pageTitle = namePage(file)

  if (titleElem && titleElem.children[0]) {
    titleElem.children[0].value = `${pageTitle} | ${siteTitle}`
  }
}

exports.addBaseTag = ({ basePath }) => (node, filename) => {
  const headElem = findHastnode(node, n => n.tagName === 'head')

  if (!headElem || basePath === '/') return

  headElem.children.push(h('base', { href: basePath }))
}
