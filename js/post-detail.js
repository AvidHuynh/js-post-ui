import postApi from './api/postAPI'
import { setTextContent, registerLightBox } from './utils'
import dayjs from 'dayjs'

function renderPostDetail(post) {
  if (!post) return
  // render title
  // render description
  // render author
  // render updatedAt
  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD/MM/YYYY HH:mm')
  )
  // render hero image
  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`
    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://picsum.photos/seed/picsum/1368/100'
    })
  }
  // render edit page link
  const editPost = document.getElementById('goToEditPageLink')
  if (editPost) {
    editPost.href = `/add-edit-post.html?id=${post.id}`
    editPost.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
  }
}

;(async () => {
  try {
    registerLightBox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightBoxImg"]',
      prevSelector: 'button[data-id="lightBoxPrev"]',
      nextSelector: 'button[data-id="lightBoxNext"]',
    })
    // get post id from url
    // fetch post detail API
    // render post detail
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')
    if (!postId) {
      console.log('Post not found')
      return
    }
    const post = await postApi.getByID(postId)
    renderPostDetail(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
  }
})()
