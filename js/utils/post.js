import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './commons';

dayjs.extend(relativeTime)

export function createPostElement(post) {
  if (!post) return
  // find and clone template
  const postElement = document.getElementById('postTemplate')
  if (!postElement) return

  const liElement = postElement.content.firstElementChild.cloneNode(true)
  if (!liElement) return

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

  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', () => {
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }
  // go to detail-page when click post

  return liElement
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return
  const ulElement = document.getElementById(elementId)

  if (!ulElement) return
  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
