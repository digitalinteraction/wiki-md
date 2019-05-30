const { sitetree } = require('../components')

// const makeFile = (inputFile, outFile, data, contents) => ({
//   inputFile, outFile, data, contents
// })

describe('sitetree', () => {
  it('should return a <nav> element', () => {
    let result = sitetree([], '/')
    expect(result.tagName).toBe('nav')
  })

  it('should populate with files', () => {
    let files = []
    let result = sitetree(files)
    expect(result)
  })
})
