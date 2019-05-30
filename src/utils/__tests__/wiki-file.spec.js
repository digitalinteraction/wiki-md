const { WikiFile } = require('../wiki-file')

describe('WikiFile', () => {
  describe('#constructor', () => {
    it('should set properties', () => {
      let file = new WikiFile('input', 'output', {}, 'contents')
      expect(file.inputFile).toEqual('input')
      expect(file.outFile).toEqual('output')
      expect(file.data).toEqual({})
      expect(file.contents).toEqual('contents')
      expect(file.html).toEqual('')
    })
  })
})
