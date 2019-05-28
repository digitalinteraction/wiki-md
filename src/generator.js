//
// Logic for generating a website from a structured set of markdown files
//

const { promisify } = require('util')
const { join, dirname } = require('path')

const matter = require('gray-matter')

const glob = promisify(require('glob'))

const unified = require('unified')
const parseMarkdown = require('remark-parse')
const mdToHtml = require('remark-rehype')
const toHtmlString = require('rehype-stringify')
const wrapInHtmlDoc = require('rehype-document')

const plugin = require('./plugins')
const component = require('./components')
const {
  renderSass,
  readFile,
  writeFile,
  ensureDir,
  trimSlashes,
  StopWatch
} = require('./utils')

exports.generate = async function(argv) {
  // Ensure the basePath is wrapped in slashes
  if (argv.basePath !== '/') argv.basePath = `/${trimSlashes(argv.basePath)}/`

  const {
    indexFile,
    themeColor,
    themeInvert,
    indir,
    outdir,
    siteTitle,
    basePath,
    verbose
    // ownerName,
    // ownerLink
  } = argv

  const stopwatch = new StopWatch('#generate')

  const infile = file => join(process.cwd(), indir, file)
  const outfile = file => join(process.cwd(), outdir, file)

  let matches = await glob(`**/*.md`, {
    cwd: infile('.'),
    ignore: ['**/node_modules/**', `**/${outdir}/**`, `**/README.md`]
  })

  stopwatch.record('#glob')

  // Read in the logic & theme files and ensure the output directory exists
  const [logicJs, sass] = await Promise.all([
    readFile(join(__dirname, 'logic.js')),
    renderSass(join(__dirname, 'theme.sass'), themeColor, themeInvert),
    ensureDir(outfile(''))
  ])

  stopwatch.record('#generateAssets')

  // Write css, and js to files
  await Promise.all([
    writeFile(outfile('theme.css'), sass.css),
    writeFile(outfile('logic.js'), logicJs)
  ])

  stopwatch.record('#writeAssets')

  let files = []
  let indexPageRegex = new RegExp(`${indexFile}\\.md`)
  let allOutDirs = new Set()

  // Load the front matter from each file
  await Promise.all(
    matches.map(async match => {
      let data = await readFile(infile(match), 'utf8')

      let targetFile = match
        .replace(/^\d+-/, '')
        .replace(indexPageRegex, 'index.md')
        .replace(/\.md$/, '.html')

      files.push({
        inputFile: match,
        outFile: targetFile,
        ...matter(data)
      })

      allOutDirs.add(outfile(dirname(match)))
    })
  )

  stopwatch.record('#readPages')

  const sitetree = component.sitetree(files, argv.basePath)

  const markdownProcessor = unified()
    .use(parseMarkdown)
    .use(mdToHtml)
    .use(plugin.injectPageStructure, { ...argv, sitetree })
    .use(wrapInHtmlDoc, {
      title: siteTitle,
      css: [join(basePath, 'theme.css')],
      js: [join(basePath, 'logic.js')],
      link: [{ rel: 'icon', href: join(basePath, 'favicon.png') }]
    })
    .use(plugin.updateDocumentTitle, { ...argv })
    .use(plugin.identifyTitles)
    .use(toHtmlString)

  // Render each file
  await Promise.all(
    files.map(file => {
      // 'gray-matter' sets .content (singular), 'unified' needs .contents (plural)
      file.contents = file.content

      return markdownProcessor.process(file).then(html => {
        file.html = html
      })
    })
  )

  stopwatch.record('#renderPages')

  // Ensure all required directories exist
  await Promise.all(
    Array.from(allOutDirs).map(directory => ensureDir(directory))
  )

  stopwatch.record('#createDirs')

  // Write each file
  await Promise.all(
    files.map(file => writeFile(outfile(file.outFile), file.html))
  )

  stopwatch.record('#writePages')

  // If in verbose mode, output the timings report
  if (verbose) stopwatch.output()
}
