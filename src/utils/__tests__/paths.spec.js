const { handlify, trimSlashes } = require('../paths')

describe('#handlify', () => {
  it('should replace whitespace, lower case and remove whitespace', () => {
    let result = handlify('A really / complicated   string. Ok 1234')
    expect(result).toEqual('a-really-complicated-string-ok-1234')
  })
})

describe('#trimSlashes', () => {
  it('should remove preceding slashes', () => {
    let result = trimSlashes('//hello/world')
    expect(result).toEqual('hello/world')
  })
  it('should remove proceding slashes', () => {
    let result = trimSlashes('hello/world//')
    expect(result).toEqual('hello/world')
  })
})
