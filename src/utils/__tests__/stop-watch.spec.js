const { StopWatch } = require('../stop-watch')

describe('StopWatch', () => {
  describe('#constructor', () => {
    it('should setup properties', () => {
      let s = new StopWatch('test_title')
      expect(s.title).toEqual('test_title')
      expect(s.startedAt).toEqual(expect.any(Number))
      expect(s.timeseries).toEqual([])
    })
  })

  describe('#record', () => {
    it('should add a timeseries value', () => {
      let s = new StopWatch('')
      s.record('event_a')
      expect(s.timeseries).toHaveLength(1)
      expect(s.timeseries).toContainEqual({
        title: 'event_a',
        time: expect.any(Number)
      })
    })
  })

  describe('#output', () => {
    it('should render messages', () => {
      let messages = []
      let logger = (...msgs) => messages.push(msgs.join(' '))

      let s = new StopWatch('test_title')

      s.record('event_a')
      s.record('event_b')
      s.record('event_c')

      s.output(logger)

      expect(messages).toHaveLength(5)

      expect(messages).toContainEqual(expect.stringMatching(/test_title/))
      expect(messages).toContainEqual(expect.stringMatching(/event_a/))
      expect(messages).toContainEqual(expect.stringMatching(/event_b/))
      expect(messages).toContainEqual(expect.stringMatching(/event_c/))
      expect(messages).toContainEqual(expect.stringMatching(/Total time/))
    })
  })
})
