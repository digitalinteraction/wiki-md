# wiki-md

Quickly generate a wiki website from structured markdown files.

<!-- toc-head -->

## Table of contents

- [Usage](#usage)
  - [GitLab CI usage](#gitlab-ci-usage)
  - [NPM usage](#npm-usage)
  - [Cli usage](#cli-usage)
- [Development](#development)
  - [Setup](#setup)
  - [Regular use](#regular-use)
  - [Irregular use](#irregular-use)
  - [Testing](#testing)
  - [Code formatting](#code-formatting)

<!-- toc-tail -->

## Usage

This cli is designed to be run inside a docker container.

The command below will:

- Read in markdown files from `./your_pages_directory`
- Write html files to `./your_output_directory`
- Set the theme colour to `#4b8aee`

```bash
docker run -it --rm \
  -v `pwd`/your_pages_directory:/pages \
  -v `pwd`/your_output_directory:/dist \
  openlab/wiki-md --theme-color="#4b8aee"
```

### GitLab CI usage

Below is an example of using `wiki-md` in a [GitLab CI] pipeline, it does a few things:

- Runs command inside the `openlab/wiki-md` docker image
- Offers customisation through pipeline variables
- Deploys assets to a server via SCP
  - Authenticated with an ssh key added via pipeline variables

```yaml
build_and_deploy:
  image:
    name: openlab/wiki-md:0.3.1
    entrypoint: ['/bin/sh', '-c']
  tags:
    - docker
  script:
    - wiki-md . dist --theme-color="$THEME_COLOR" --site-title="SOPs"
    - tar -czf dist.tar.gz dist
    - echo "$SSH_SECRET" > deploy_key && chmod 600 deploy_key
    - scp -o StrictHostKeyChecking=no -i deploy_key dist.tar.gz $DEPLOY_HOST:$DEPLOY_PATH/dist.tar.gz
    - ssh -o StrictHostKeyChecking=no -i deploy_key $DEPLOY_HOST $DEPLOY_PATH/update.sh
```

### NPM usage

If you want to experiment you can install the cli with [npm](https://www.npmjs.com/).

```bash
# Install it globally
npm i -g @openlab/wiki-md

# Use the cli
wiki-md --help

# For example...
wiki-md pages dist --site-title="My wiki" --theme-color="#000000" --owner-name="Geoff" --owner-link="https://r0b.io" --verbose
```

### Cli usage

Below is the cli `--help` output:

```
cli.js <indir> [outdir]

Generate a site from local markdown files

Commands:
  cli.js generate <indir> [outdir]  Generate a site from local markdown files
                                                                       [default]
  cli.js serve <indir> [outdir]     Generate a site, serve it locally and
                                    regenerate on changes

Positionals:
  indir   Where to recursively look for markdown files                  [string]
  outdir  Where to put the generated html             [string] [default: "dist"]

Options:
  --version       Show version number                                  [boolean]
  --site-title    The title of the site, used in the <title> elment
                                                               [default: "Wiki"]
  --index-file    What file to use to generate index.html files[default: "home"]
  --theme-color   The primary theme color                   [default: "#23967F"]
  --theme-invert  The inverse theme color, something contrasting themeColor
                                                            [default: "#ffffff"]
  --base-path     The base directory, if served in a folder       [default: "/"]
  --owner-name    The name of the owner of the site        [default: "Open Lab"]
  --owner-link    The link to the owner of the site
                                          [default: "https://openlab.ncl.ac.uk"]
  --verbose       Whether to describe whats happening [boolean] [default: false]
  -h, --help      Show help                                            [boolean]
```

## Development

Below are instructions for developing this repo

### Setup

To develop on this repo you will need to have [Docker](https://www.docker.com/) and
[node.js](https://nodejs.org) installed on your dev machine and have an understanding of them.
This guide assumes you have the repo checked out and are on macOS, but equivalent commands are available.

You'll only need to follow this setup once for your dev machine.

```bash
# Install all dependencies using npm
npm ci
```

### Regular use

These are the commands you'll regularly run to develop the API, in no particular order.

```bash
# Run the CLI
# -> The -- is needed to that any args are passed to cli.js
npm run dev -s --

# Output cli help
npm run dev -s -- --help

# Run a http server to serve files
# -> Run in a new terminal tab
npx http-server
```

### Irregular use

These are commands you might need to run but probably won't, also in no particular order.

```bash
# Build the docker image
VERSION=0.2.0
docker build -t openlab/wiki-md:$VERSION .
docker push openlab/wiki-md:$VERSION

# Lint the source code
# -> Uses ESLint to check for common errors
npm run lint

# Format source code
# -> Uses prettier to automatically format code
# -> This already happens automatically when you commit (see below)
npm run prettier

# Generate the table of contents for this readme
npx md-toc -i
```

### Testing

This repo uses [unit tests](https://en.wikipedia.org/wiki/Unit_testing) to ensure that everything is working correctly, guide development, avoid bad code and reduce defects.
The [Jest](https://www.npmjs.com/package/jest) package is used to run unit tests.
Tests are any file in `src/` that end with `.spec.js`, by convention they are inline with the source code,
in a parallel folder called `__tests__`.

```bash
# Run the tests
npm test -s

# Generate code coverage
npm run coverage -s
```

### Code formatting

This repo uses [Prettier](https://prettier.io/) to automatically format code to a consistent standard.
It works using the [husky](https://www.npmjs.com/package/husky)
and [lint-staged](https://www.npmjs.com/package/lint-staged) packages to
automatically format code whenever code is commited.
This means that code that is pushed to the repo is always formatted to a consistent standard.

You can manually run the formatter with `npm run prettier` if you want.

Prettier is slightly configured in [.prettierrc.yml](/.prettierrc.yml)
and also ignores files using [.prettierignore](/.prettierignore).

---

> - The code at https://github.com/digitalinteraction/wiki-md is a mirror of https://openlab.ncl.ac.uk/gitlab/rob/wiki-md
> - This project was set up by [puggle](https://npm.im/puggle)
