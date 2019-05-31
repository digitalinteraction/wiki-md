const { generate } = require('../generator')

const { readFile, writeFile, mkdir, renderSass, glob } = require('../utils')

jest.mock('../utils/stop-watch')
jest.mock('../utils/promisified')
jest.spyOn(global.console, 'log')

describe('#generate', () => {
  beforeEach(() => {
    readFile.mockResolvedValue('')
    writeFile.mockResolvedValue(true)
    mkdir.mockResolvedValue(true)
    renderSass.mockResolvedValue({ css: 'p{color:red}' })
    glob.mockResolvedValue([
      'home.md',
      'about.md',
      'projects/a.md',
      'projects/b.md'
    ])
  })

  it('should generate files', async () => {
    await generate({
      indexFile: 'home',
      themeColor: 'white',
      themeInvert: 'black',
      indir: 'testdir',
      outdir: 'dist',
      siteTitle: 'TestSite',
      basePath: '/',
      verbose: true,
      ownerName: 'geoff',
      ownerLink: 'geoff.io'
    })

    expect(readFile).toHaveBeenCalled()
    expect(writeFile).toHaveBeenCalled()
    expect(mkdir).toHaveBeenCalled()

    // Check the correct assets were added
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringMatching('dist/theme.css'),
      expect.any(String)
    )

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringMatching('dist/logic.js'),
      expect.any(String)
    )

    // Check directories were created
    expect(mkdir).toHaveBeenCalledWith(
      expect.stringMatching('dist'),
      expect.anything()
    )
    expect(mkdir).toHaveBeenCalledWith(
      expect.stringMatching('dist/projects'),
      expect.anything()
    )

    // Check the correct files were made
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringMatching('dist/index.html'),
      expect.any(String)
    )
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringMatching('dist/about.html'),
      expect.any(String)
    )
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringMatching('dist/projects/a.html'),
      expect.any(String)
    )
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringMatching('dist/projects/b.html'),
      expect.any(String)
    )
  })
})
