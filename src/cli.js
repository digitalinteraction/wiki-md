const fs = require('fs')
const { promisify } = require('util')
const { join, dirname } = require('path')

const Sass = require('sass')
const yargs = require('yargs')
const matter = require('gray-matter')
const { red } = require('chalk')

const glob = promisify(require('glob'))
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)

const unified = require('unified')
const parseMarkdown = require('remark-parse')
const mdToHtml = require('remark-rehype')
const toHtmlString = require('rehype-stringify')
const wrapInHtmlDoc = require('rehype-document')

const plugin = require('./plugins')
// const component = require('./components')

async function renderSass(inputFile, primary, primaryInvert) {
  let contents = await readFile(inputFile, 'utf8')
  let variables = `$primary: ${primary}\n$primary-invert: ${primaryInvert}\n`
  
  const options = {
    data: variables + contents,
    indentedSyntax: true,
    includePaths: [join(__dirname, '../node_modules')],
    outputStyle: 'compressed'
  }
  
  return promisify(Sass.render)(options)
}

async function generate(argv) {
  // let start = argv.indir === '.' ? '' : argv.indir
  
  const {
    indexFile,
    themeColor,
    themeInvert,
    indir,
    outdir,
    siteTitle,
    basePath,
    // ownerName,
    // ownerLink,
    // compress
  } = argv
  
  const infile = file => join(process.cwd(), indir, file)
  const outfile = file => join(process.cwd(), outdir, file)
  
  let matches = await glob(`**/*.md`, {
    cwd: infile('.'),
    ignore: ['**/node_modules/**', `**/${outdir}/**`]
  })
  
  let sass = await renderSass(
    join(__dirname, 'theme.sass'),
    themeColor,
    themeInvert
  )
  
  await writeFile(
    outfile('theme.css'),
    sass.css
  )
  
  let files = []
  let indexPageRegex = new RegExp(`${indexFile}\\.md`)
  let allOutDirs = new Set()
  
  await Promise.all(matches.map(async match => {
    let data = await readFile(infile(match), 'utf8')
    
    let targetFile = match
      .replace(indexPageRegex, 'index.md')
      .replace(/\.md$/, '.html')
    
    files.push({
      inputFile: match,
      outFile: targetFile,
      ...matter(data)
    })
    
    allOutDirs.add(outfile(dirname(match)))
  }))
  
  // Filter out empty files
  files = files.filter(file => !file.isEmpty)
  
  const markdownProcessor = unified()
    .use(parseMarkdown)
    .use(mdToHtml)
    .use(plugin.injectPageStructure, { ...argv, files })
    .use(wrapInHtmlDoc, {
      title: siteTitle,
      css: [join(basePath, 'theme.css')],
      link: [{ rel: 'icon', href: join(basePath, 'favicon.png') }]
    })
    .use(plugin.updateDocumentTitle, { ...argv })
    .use(plugin.addBaseTag, { ...argv })
    .use(plugin.identifyTitles)
    .use(toHtmlString)
  
  await Promise.all(files.map(async file => {
    let result = await markdownProcessor.process({
      ...file,
      contents: file.content
    })
    
    file.html = result
  }))
  
  await Promise.all(Array.from(allOutDirs).map(
    directory => mkdir(directory, { recursive: true })
  ))
  
  await Promise.all(files.map(
    file => writeFile(outfile(file.outFile), file.html)
  ))
  
  // for (let file of files) {
  //   let dir = 
  //   await mkdir(dir, { recursive: true })
  // }
  
  // console.log(files)
}


yargs.help('h')
  .alias('h', 'help')
  .option('site-title', {
    describe: 'The title of the site, used in the <title> elment',
    default: 'Wiki'
  })
  .option('index-file', {
    describe: 'What file to use to generate index.html files',
    default: 'home'
  })
  .option('theme-color', {
    describe: 'The primary theme color',
    default: '#23967F'
  })
  .option('theme-invert', {
    describe: 'The inverse theme color, something contrasting themeColor',
    default: '#ffffff'
  })
  .option('compress', {
    describe: 'Whether to compress the output',
    default: false
  })
  .option('base-path', {
    describe: 'The base directory, if served in a folder',
    default: '/'
  })
  .option('owner-name', {
    describe: '',
    default: 'Open Lab'
  })
  .option('owner-link', {
    describe: '',
    default: 'https://openlab.ncl.ac.uk'
  })
  .command(
    '$0 [indir] [outdir]',
    'asdasdas',
    yargs => yargs
      .positional('indir', {
        type: 'string',
        default: '.',
        describe: 'Where to recursively look for markdown files'
      })
      .positional('outdir', {
        type: 'string',
        default: 'dist',
        describe: 'Where to put the generated html'
      }),
    async argv => {
      try {
        await generate(argv)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log(error)
        } else {
          console.log(red('𐄂'), error.message)
        }
      }
    }
  )
  .parse()
