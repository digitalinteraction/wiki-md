const h = require('hastscript')
const { findHastNode, findAllHastNodes, textValue } = require('../hast')

const rootNode = h('body', [
  h('div'),
  h('div'),
  h('div', [h('span'), h('span'), h('span'), h('span')])
])

const textNodes = h('p', ['Hello, world. ', 'Are you ok?'])

describe('#findHastNode', () => {
  it('should return the first matching node', () => {
    let result = findHastNode(rootNode, n => n.tagName === 'div')
    expect(result).toBe(rootNode.children[0])
  })
  it('should find nested nodes', () => {
    let result = findHastNode(rootNode, n => n.tagName === 'span')
    expect(result).toBe(rootNode.children[2].children[0])
  })
})

describe('#findAllHastNodes', () => {
  it('should return all matches', () => {
    let result = findAllHastNodes(rootNode, n => n.tagName === 'div')
    expect(result).toHaveLength(3)
  })
  it('should return all nested matches', () => {
    let result = findAllHastNodes(rootNode, n => n.tagName === 'span')
    expect(result).toHaveLength(4)
  })
})

describe('#textValue', () => {
  it('should concatenate text nodes', () => {
    let result = textValue(textNodes)
    expect(result).toEqual('Hello, world. Are you ok?')
  })
})
