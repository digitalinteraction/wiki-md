//
// Client side logic for the generated site
//

;(() => {
  let sitetree = document.querySelector('.sitetree')

  let modal = document.querySelector('.modal')
  let modalBox = document.querySelector('.modal-content .box')
  let modalClose = document.querySelector('.modal-close')

  let sitetreeButton = document.querySelector('.navbar-burger')

  /** Create a DOM element with a text value */
  function h(tagName, attrs, text) {
    let elem = document.createElement(tagName)
    for (let key in attrs) elem.setAttribute(key, attrs[key])
    elem.innerText = text
    return elem
  }

  // Close the modal when the cross is clicked
  modalClose.addEventListener('click', e => {
    modal.classList.remove('is-active')
    modalBox.innerHTML = ''
  })

  // Add the modal when the menu button is clicked
  sitetreeButton.addEventListener('click', e => {
    modal.classList.add('is-active')

    // Clone the sitetree from the mobile-hidden element
    let cloned = sitetree.cloneNode(true)
    cloned.classList.add('is-active')

    // Add the contents to the modal
    modalBox.appendChild(h('h2', { class: 'title is-3' }, 'Pages'))
    modalBox.appendChild(cloned)
  })
})()
