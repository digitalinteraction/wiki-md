const Sass = require('sass')

let { renderSass } = require('../sass')
let { readFile } = require('../promisified')

// const renderMock =
jest.mock('sass')

jest.mock('../promisified')

describe('#renderSass', () => {
  beforeEach(() => {
    Sass.render.mockImplementation((...args) => args.pop()(null, '_css_'))
    readFile.mockImplementation(() => Promise.resolve('sass'))
  })

  it('should call Sass.render', async () => {
    await renderSass('some-path', '#fff', '#000')
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
