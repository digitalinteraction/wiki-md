let { generateCss } = require('../sass')
let { readFile, renderSass } = require('../promisified')

jest.mock('../promisified')

describe('#renderSass', () => {
  beforeEach(() => {
    readFile.mockResolvedValue('sass')
    renderSass.mockResolvedValue('p{color:red}')
  })

  it('should call Sass.render', async () => {
    await generateCss('some-path', '#fff', '#000')

    expect(renderSass).toBeCalledWith(
      expect.objectContaining({
        data: expect.any(String),
        indentedSyntax: true,
        includePaths: expect.arrayContaining([
          expect.stringMatching(/node_modules/)
        ]),
        outputStyle: 'compressed'
      })
    )
  })
})
