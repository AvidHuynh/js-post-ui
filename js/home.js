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

;(async () => {
  // Call API
  try {
    const queryParams = {
      _page: 1,
      _limit: 9,
    }
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
  }
})()
