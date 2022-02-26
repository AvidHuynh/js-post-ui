import dayjs from 'dayjs'
import postApi from './api/postAPI'
import { setTextContent, truncateText } from './utils'
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
  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function handlePrevPagination(e) {
  e.preventDefault()
  console.log('prev')
}

function handleNextPagination(e) {
  e.preventDefault()
  console.log('next')
}

function initPagination() {
  const ulPagination = document.getElementById('postsPagination')
  if (!ulPagination) return

  const prevPagination = ulPagination.firstElementChild?.firstElementChild
  if (prevPagination) {
    prevPagination.addEventListener('click', handlePrevPagination)
  }

  const nextPagination = ulPagination.lastElementChild?.lastElementChild
  if (nextPagination) {
    nextPagination.addEventListener('click', handleNextPagination)
  }
}

function initURL() {
  // update query params on URL
  const url = new URL(window.location)
  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
  history.pushState({}, '', url)
}

;(async () => {
  // Call ANI
  try {
    initPagination()
    initURL()
    const queryParams = new URLSearchParams(window.location.search)
    // set default query parmas if not existed
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
