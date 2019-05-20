# wiki-md

Generate a wiki from structure markdown files.

## Usage

This cli is designed to be run inside a docker container

```bash
docker run -it --rm \
  -v `pwd`/your_pages_directory:/pages \
  -v `pwd`/your_output_directory:/dist \
  openlab/wiki-md --theme-color="#4b8aee"
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

> This project was set up by [puggle](https://npm.im/puggle)
