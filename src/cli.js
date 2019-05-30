#!/usr/bin/env node

//
// CLI entrypoint
//

const yargs = require('yargs')
const { red } = require('chalk')
const { generate } = require('./generator')

const HttpServer = require('http-server')
const chokidar = require('chokidar')
const debounce = require('lodash.debounce')

const generatorYargs = yargs =>
  yargs
    .positional('indir', {
      describe: 'Where to recursively look for markdown files',
      demand: 'Specify input directory',
      type: 'string'
    })
    .positional('outdir', {
      describe: 'Where to put the generated html',
      type: 'string',
      default: 'dist'
    })

yargs
  .help()
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
  .option('base-path', {
    describe: 'The base directory, if served in a folder',
    default: '/'
  })
  .option('owner-name', {
    describe: 'The name of the owner of the site',
    default: 'Open Lab'
  })
  .option('owner-link', {
    describe: 'The link to the owner of the site',
    default: 'https://openlab.ncl.ac.uk'
  })
  .option('verbose', {
    type: 'boolean',
    describe: 'Whether to describe whats happening',
    default: process.env.NODE_ENV === 'development'
  })
  .command(
    ['generate <indir> [outdir]', '$0 <indir> [outdir]'],
    'Generate a site from local markdown files',
    yargs => generatorYargs(yargs),
    async argv => {
      try {
        await generate(argv)
      } catch (error) {
        if (argv.verbose) console.log(error)
        else console.log(red('𐄂'), error.message)
      }
    }
  )
  .command(
    ['serve <indir> [outdir]'],
    'Generate a site, serve it locally and regenerate on changes',
    yargs =>
      generatorYargs(yargs)
        .option('port', {
          describe: 'The port to run on',
          type: 'number',
          default: 8080
        })
        .option('debounce', {
          describe: 'How long after the last file change to regenerate assets',
          type: 'number',
          default: 3000
        }),
    async argv => {
      const generateAssets = debounce(() => generate(argv), argv.debounce)

      //
      // Start a http server
      //
      let server = HttpServer.createServer({ root: 'dist' })
      await new Promise(resolve => server.listen(argv.port, resolve))
      console.log(`Listening on :${argv.port}`)

      // Create a watcher for files inside 'src'
      const watcher = chokidar.watch([`${argv.indir}/**/*.md`], {
        cwd: process.cwd(),
        ignoreInitial: true
      })

      // Add the sass file too
      watcher.add('src/**/*.sass')

      // Rebuild the site when any file changes
      watcher
        .on('add', generateAssets)
        .on('change', generateAssets)
        .on('unlink', generateAssets)

      // Initially generate assets
      await generateAssets()
    }
  )
  .parse()
