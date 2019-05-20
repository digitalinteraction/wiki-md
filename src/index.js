//
// The app entrypoint, used when require-ed as a package
//

const { generate } = require('./generator')

module.exports = {
  components: require('./components'),
  plugins: require('./plugins'),
  utils: require('./utils'),
  generate: generate
}
