const h = require('hastscript')
const { WikiFile } = require('../utils')
const { sitetree, pagetree } = require('../components')

const toText = require('hast-util-to-text')

// const makeFile = (inputFile, outFile, data, contents) => ({
//   inputFile, outFile, data, contents
// })

describe('#sitetree', () => {
  it('should return a <nav> element', () => {
    let result = sitetree([], '/')
    expect(result.tagName).toBe('nav')
  })

  it('should populate with files', () => {
    let files = [
      new WikiFile('home.md', 'index.html'),
      new WikiFile('about.md', 'about.html'),
      new WikiFile('project/a.md', 'project/a.html'),
      new WikiFile('project/b.md', 'project/b.html')
    ]
    let result = sitetree(files)

    // Check there is a top-level label and list
    expect(result.children).toHaveLength(2)
    expect(result.children[0].tagName).toEqual('p')
    expect(result.children[1].tagName).toEqual('ul')

    // Check each top level file is a list item
    // One for each file and a 'projects' list
    let rootItems = result.children[1].children
    expect(rootItems).toHaveLength(3)
    expect(rootItems[0].tagName).toEqual('li')
    expect(rootItems[1].tagName).toEqual('li')
    expect(rootItems[2].tagName).toEqual('li')

    // Check the project is a label and list
    let projItems = rootItems[2].children
    expect(projItems).toHaveLength(2)
    expect(projItems[0].tagName).toEqual('p')
    expect(projItems[1].tagName).toEqual('ul')

    let projList = projItems[1].children
    expect(projList).toHaveLength(2)
    expect(projList[0].tagName).toEqual('li')
    expect(projList[1].tagName).toEqual('li')
  })
})

describe('#pagetree', () => {
  let content = h('.content', [
    h('h1', 'heading_a'),
    h('h2', 'heading_b'),
    h('h2', 'heading_c'),
    h('h3', 'heading_d'),
    h('h2', 'heading_e'),
    h('h3', 'heading_f'),
    h('h4', 'heading_g'),
    h('h3', 'heading_h'),
    h('h2', 'heading_i')
  ])

  it('should return null with no headings', () => {
    let result = pagetree(h('div', []))
    expect(result).toEqual(null)
  })
  it('should return a <nav>', () => {
    let result = pagetree(content)
    expect(result.tagName).toEqual('nav')
  })
  it('should have a <li> for each heading below h1', () => {
    let result = pagetree(content)
    let [ol] = result.children

    expect(ol.children).toHaveLength(8)
  })
  it('should order headings correctly', () => {
    let result = pagetree(content)
    let [ol] = result.children

    expect(toText(ol.children[0])).toEqual('heading_b')
    expect(toText(ol.children[1])).toEqual('heading_c')
    expect(toText(ol.children[2])).toEqual('heading_d')
    expect(toText(ol.children[3])).toEqual('heading_e')
    expect(toText(ol.children[4])).toEqual('heading_f')
    expect(toText(ol.children[5])).toEqual('heading_g')
    expect(toText(ol.children[6])).toEqual('heading_h')
    expect(toText(ol.children[7])).toEqual('heading_i')
  })
  it('should add a level class to headings', () => {
    let result = pagetree(content)
    let [ol] = result.children

    expect(ol.children[2].properties.className).toContain('level-3')
  })
})
