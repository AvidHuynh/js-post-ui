export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  const prevClick = ulPagination.firstElementChild?.firstElementChild
  if (prevClick) {
    prevClick.addEventListener('click', (e) => {
      e.preventDefault()
      const page = Number.parseInt(ulPagination.dataset.page) || 1
      if (page > 2) onChange?.(page - 1)
    })
  }

  const nextClick = ulPagination.lastElementChild?.lastElementChild
  if (nextClick) {
    nextClick.addEventListener('click', (e) => {
      e.preventDefault()
      const totalPages = ulPagination.dataset.totalPages
      const page = Number.parseInt(ulPagination.dataset.page) || 1
      if (page < totalPages) onChange?.(page + 1)
    })
  }
}

export function renderPagination(elementId,pagination) {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination || !pagination) return
  // calc totalPages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)
  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages
  // check if enable/disabled prev/next links
  // prev
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')
  // next
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}
