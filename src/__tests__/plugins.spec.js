const h = require('hastscript')
const { WikiFile } = require('../utils')
const plugin = require('../plugins')
const query = require('hast-util-select')
const toText = require('hast-util-to-text')

let file, children, content

beforeEach(() => {
  file = new WikiFile('home.md', 'index.html', { title: 'TestPage' })
  children = [
    h('h1', 'Lorem ipsum'),
    h('p', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
    h('p', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
    h('p', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
  ]
  content = h('d', children)
})

describe('#injectPageStructure', () => {
  const options = {
    siteTitle: 'Test site',
    ownerLink: 'https://geoff.r0b.io',
    ownerName: 'geoff',
    basePath: '/',
    sitetree: null
  }

  it('should move initial children into the page', () => {
    plugin.injectPageStructure(options)(content, file)

    let wrapper = query.select(
      'main section.section .container .page-wrapper',
      content
    )

    expect(wrapper).not.toBeNull()

    let wrapperContent = query.select('.content', wrapper)
    expect(wrapperContent.children).toContain(children[0])
    expect(wrapperContent.children).toContain(children[1])
    expect(wrapperContent.children).toContain(children[2])
    expect(wrapperContent.children).toContain(children[3])
  })
})

describe('#identifyTitles', () => {
  it('should add titles to headings', () => {
    plugin.identifyTitles()(content)
    expect(children[0].properties.id).toEqual('lorem-ipsum')
  })
})

describe('#updateDocumentTitle', () => {
  it('should update the title', () => {
    let title = h('title', 'old title')
    let html = h('html', [h('head', [title])])

    plugin.updateDocumentTitle({ siteTitle: 'new title' })(html, file)

    expect(toText(title)).toEqual('TestPage | new title')
  })
})
