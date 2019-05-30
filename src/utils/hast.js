function findHastNode(node, predicate) {
  if (!node.children) return null
  for (let child of node.children) {
    if (predicate(child)) return child

    const nested = findHastNode(child, predicate)
    if (nested) return nested
  }
  return null
}

function findAllHastNodes(node, predicate) {
  let result = []

  if (!node.children) return result

  for (let child of node.children) {
    if (predicate(child)) result.push(child)

    result.push(...findAllHastNodes(child, predicate))
  }

  return result
}

function textValue(elem) {
  return elem.children.map(n => (n.type === 'text' ? n.value : '')).join('')
}

module.exports = { findHastNode, findAllHastNodes, textValue }
