const ms = require('ms')

/** a class for timing a series of operations, then outputing them to the console */
exports.StopWatch = class {
  constructor(title) {
    this.title = title
    this.startedAt = Date.now()
    this.timeseries = []
  }

  record(title) {
    this.timeseries.push({ title, time: Date.now() })
  }

  output(logger = console.log) {
    logger(`StopWatch: ${this.title}`)

    let currentTime = this.startedAt

    for (let item of this.timeseries) {
      logger(`- ${ms(item.time - currentTime)} ${item.title}`)
      currentTime = item.time
    }

    logger(`Total time: ${ms(currentTime - this.startedAt)}`)
  }
}
