const Sass = require('sass')

let { generateCss } = require('../sass')
let { readFile, renderSass } = require('../promisified')

// const renderMock =
jest.mock('sass')

jest.mock('../promisified')

describe('#renderSass', () => {
  beforeEach(() => {
    readFile.mockResolvedValue('sass')
    renderSass.mockResolvedValue('p{color:red}')
  })

  it('should call Sass.render', async () => {
    await generateCss('some-path', '#fff', '#000')
    expect(Sass.render).toBeCalledWith(
      expect.objectContaining({
        data: expect.any(String),
        indentedSyntax: true,
        includePaths: expect.arrayContaining([
          expect.stringMatching(/node_modules/)
        ]),
        outputStyle: 'compressed'
      }),
      expect.any(Function)
    )
  })
})
