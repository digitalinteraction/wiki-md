const fs = require('fs')

function ensureDir(path) {
  let stats

  try {
    stats = fs.statSync(path)
  } catch (error) {
    return exports.mkdir(path, { recursive: true })
  }

  if (!stats || !stats.isDirectory()) {
    throw new Error(`'${path}' exists and isn't a directory`)
  }
}

module.exports = { ensureDir }
