import dayjs from 'dayjs'
import postApi from './api/postAPI'
import { getUlPagination, setTextContent, truncateText } from './utils'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return
  // find and clone template
  const postElement = document.getElementById('postTemplate')
  if (!postElement) return
  const liElement = postElement.content.firstElementChild.cloneNode(true)
  if (!liElement) return
  // update title, description, author, thumbnail
  // const titleElement = liElement.querySelector('[data-id="title"]')
  // if (titleElement) titleElement.textContent = post.title
  // const descriptionElement = liElement.querySelector('[data-id="description"]')
  // if (descriptionElement) descriptionElement.textContent = post.description
  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if (authorElement) authorElement.textContent = post.author
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://picsum.photos/seed/picsum/400/200'
    })
  }

  return liElement
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return
  const ulElement = document.getElementById('postList')
  if (!ulElement) return
  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function initPagination() {
  const ulPagination = getUlPagination()
  if (!ulPagination) return
  const prevPagination = ulPagination.firstElementChild?.firstElementChild
  if (prevPagination) {
    prevPagination.addEventListener('click', handlePrevClick)
  }
  const nextPagination = ulPagination.lastElementChild?.lastElementChild
  if (nextPagination) {
    nextPagination.addEventListener('click', handleNextClick)
  }
}

function handlePrevClick(e) {
  e.preventDefault()
  const ulPagination = getUlPagination()
  if (!ulPagination) return
  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return
  handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
  e.preventDefault()
  const ulPagination = getUlPagination()
  if (!ulPagination) return
  const totalPages = ulPagination.dataset.totalPages
  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page >= totalPages) return
  handleFilterChange('_page', page + 1)
}

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location)
  url.searchParams.set(filterName, filterValue)
  history.pushState({}, '', url)

  const { data, pagination } = await postApi.getAll(url.searchParams)
  renderPostList(data)
  renderPagination(pagination)
}

function initURL() {
  // update query params on URL
  const url = new URL(window.location)
  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)
  history.pushState({}, '', url)
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination()
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

;(async () => {
  // Call ANI
  try {
    initPagination()
    initURL()
    const queryParams = new URLSearchParams(window.location.search)
    // set default query parmas if not existed
    // fetch data from API
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
