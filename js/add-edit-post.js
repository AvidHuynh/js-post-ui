import postApi from './api/postAPI'
import { initPostForm } from './utils'
import { toast } from './utils/toast'

function removerUnusedFields(formValues) {
  const payload = { ...formValues }
  // imageSource = 'picsum' -> remove image
  // imageSource = 'upload' -> remove imageUrl
  // finally remove imageSource
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl
  } else {
    delete payload.image
  }
  // finnaly remove imageSource
  delete payload.imageSource
  // remove id if it's add mode
  if (!payload.id) delete payload.id
  return payload
}

function jsonFormData(jsonObject) {
  const formData = new FormData()
  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }
  return formData
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removerUnusedFields(formValues)
    const formData = jsonFormData(payload)
 
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

    // show success message
    toast.success('Success post update')
    
    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    }, 1000)
  } catch (error) {
    console.log('failed to save post', error)
    toast.error(`Error: ${error.message}`)
  }
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValues = Boolean(postId)
      ? await postApi.getByID(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('Error', error)
  }
})()
