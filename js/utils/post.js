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

  // go to detail-page when click post
  const divElement = liElement.firstElementChild;
  if (divElement) {
    divElement.addEventListener('click', (event) => {
      // Option 2: if event is triggered from menu -> ignore
      const menuElement = liElement.querySelector('[data-id="menuEdit"]');
      if (menuElement && menuElement.contains(event.target)) return
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  // go to edit-page when click post
  const menuEditElement = liElement.querySelector('[data-id="edit"]');
  if (menuEditElement) {
    menuEditElement.addEventListener('click', (e) => {
      // Option 1: prebent evern bubbing to parent
      // e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

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
