function showModal(modalElement) {
  if (!window.bootstrap) return
  const myModal = new window.bootstrap.Modal(modalElement)
  if (myModal) myModal.show()
}

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  // handle click for all img -> Event Delegation
  // img click -> find all imgs with the same album .gallery
  // determine index of selected img
  // show modal woth selected img
  // hanlde prev/ next click
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // check if this midak us regustered or not - ngăn chặn đăng ký sự kiện nhiều lần
  if (Boolean(modalElement.dataset.registered)) return

  const imageElement = document.querySelector(imgSelector)
  const prevButton = document.querySelector(prevSelector)
  const nextButton = document.querySelector(nextSelector)
  if (!imageElement || !prevButton || !nextButton) return

  let imgList = []
  let curentIndex = 0

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src
  }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return
    // img ưith data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    curentIndex = [...imgList].findIndex((x) => x === target)
    console.log('album target', { target, imgList, curentIndex })
    showImageAtIndex(curentIndex)
    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    // show image prev
    curentIndex = (curentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(curentIndex)
  })
  nextButton.addEventListener('click', () => {
    // show image next
    curentIndex = (curentIndex + 1) % imgList.length
    showImageAtIndex(curentIndex)
  })
  modalElement.dataset.registered = 'true'
}
