;(() => {
  let sitetree = document.querySelector('.sitetree')

  let modal = document.querySelector('.modal')
  let modalBox = document.querySelector('.modal-content .box')
  let modalClose = document.querySelector('.modal-close')

  let sitetreeButton = document.querySelector('.navbar-burger')
  // let pagetreeButton = document.querySelector('#togglePagetree')

  function h(tagName, attrs, text) {
    let elem = document.createElement(tagName)

    for (let key in attrs) {
      elem.setAttribute(key, attrs[key])
    }

    elem.innerText = text
    return elem
  }

  modalClose.addEventListener('click', e => {
    modal.classList.remove('is-active')
    modalBox.innerHTML = ''
  })

  sitetreeButton.addEventListener('click', e => {
    modal.classList.add('is-active')

    let cloned = sitetree.cloneNode(true)
    cloned.classList.add('is-active')

    modalBox.appendChild(h('h2', { class: 'title is-3' }, 'Pages'))
    modalBox.appendChild(cloned)
  })
})()
