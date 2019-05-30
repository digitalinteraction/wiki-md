function handlify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w]+/g, '-')
    .replace(/-+$/, '')
}

const trimSlashes = str => str.replace(/^\/+/, '').replace(/\/+$/, '')

module.exports = { handlify, trimSlashes }
