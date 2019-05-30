const { VNode } = require('../v-node')

describe('VNode', () => {
  describe('#constructor', () => {
    it('should setup properties', () => {
      let n = new VNode('geoff', 'test_value')
      expect(n.name).toEqual('geoff')
      expect(n.children).toEqual([])
      expect(n.value).toEqual('test_value')
    })
  })

  describe('#addChild', () => {
    let parent

    beforeEach(() => {
      parent = new VNode('parent')
    })

    it('should add the child', () => {
      let child = new VNode('child')
      parent.addChild(child)
      expect(parent.children).toContain(child)
    })

    it('should add intermediate nodes', () => {
      let child = new VNode('group/child')
      parent.addChild(child)
      expect(parent.children).toHaveLength(1)
      expect(parent.children[0].children).toContain(child)
    })

    it('should set intermediate names', () => {
      let child = new VNode('/group/child/')
      parent.addChild(child)

      let [subchild] = parent.children
      expect(subchild.name).toEqual('group')

      expect(child.name).toEqual('child')
    })
  })

  describe('#sort', () => {
    let parent

    beforeEach(() => {
      parent = new VNode('parent')
    })

    it('should order children', () => {
      parent.addChild(new VNode('child_b'))
      parent.addChild(new VNode('child_c'))
      parent.addChild(new VNode('child_a'))

      parent.sort((a, b) => a.name > b.name)
      expect(parent.children[0].name).toEqual('child_a')
      expect(parent.children[1].name).toEqual('child_b')
      expect(parent.children[2].name).toEqual('child_c')
    })

    it('should order nested nodes too', () => {
      parent.addChild(new VNode('group/child_c'))
      parent.addChild(new VNode('group/child_b'))
      parent.addChild(new VNode('group/child_d'))
      parent.addChild(new VNode('child_a'))

      parent.sort((a, b) => a.name > b.name)

      expect(parent.children[0].name).toEqual('child_a')

      let { children } = parent.children[1]

      expect(children[0].name).toEqual('child_b')
      expect(children[1].name).toEqual('child_c')
      expect(children[2].name).toEqual('child_d')
    })
  })

  describe('#map', () => {
    it('should map using the lamda', () => {
      let parent = new VNode('parent')
      parent.addChild(new VNode('child_a'))
      parent.addChild(new VNode('group/child_b'))
      parent.addChild(new VNode('group/child_c'))
      parent.addChild(new VNode('group/child_d'))

      let spy = jest.fn()
      parent.map(spy)

      // Check it was called for each node (+ the root and group)
      expect(spy).toHaveBeenCalledTimes(6)
    })
  })
})
