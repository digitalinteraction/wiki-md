exports.WikiFile = class {
  constructor(inputFile, outFile, data = {}, contents = '') {
    this.inputFile = inputFile
    this.outFile = outFile
    this.data = data
    this.contents = contents
    this.html = ''
  }
}
