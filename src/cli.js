const yargs = require('yargs')
const ms = require('ms')
const { red, green } = require('chalk')
const { generate } = require('./generator')

yargs
  .help('h')
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
    describe: 'The name of the owner of the site',
    default: 'Open Lab'
  })
  .option('owner-link', {
    describe: 'The link to the owner of the site',
    default: 'https://openlab.ncl.ac.uk'
  })
  .option('verbose', {
    type: 'boolean',
    describe: 'Whether to describe whats happending',
    default: process.env.NODE_ENV === 'development'
  })
  .command(
    '$0 [indir] [outdir]',
    'asdasdas',
    yargs =>
      yargs
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
        if (argv.verbose) console.log(error)
        else console.log(red('𐄂'), error.message)
      }
    }
  )
  .parse()
