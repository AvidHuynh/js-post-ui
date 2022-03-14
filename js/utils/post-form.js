import { setFieldValues, setBackgroundImage, setTextContent, randomNumber } from './commons'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

function setFormValues(form, formValues) {
  setFieldValues(form, '[name="title"]', formValues?.title)
  setFieldValues(form, '[name="author"]', formValues?.author)
  setFieldValues(form, '[name="description"]', formValues?.description)
  setFieldValues(form, '[name="imageUrl"]', formValues?.imageUrl) // hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

function getFormValues(form) {
  const formValue = {}
  // S1: query each input and add to formValue object
  // ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) formValue[name] = field.value
  // })
  // S2: use FormData, read more -> https://developer.mozilla.org/en-US/docs/Web/API/FormData
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValue[key] = value
  }
  return formValue
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image')
        .url('Please enter a valid URL'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (file) => Boolean(file?.name))
        .test('max-3MB', 'The image is too large (max 3MB)', (file) => {
          const fileSize = file?.size || 0
          const MAX_SIZE = 3 * 1024 * 1024 //3MB
          return fileSize <= MAX_SIZE
        }),
    }),
  })
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))
    // start validating
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
    // trường hợp không có error thì sẽ chuyển tới bước dòng isValid
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path
        // ignore if the field is already logged
        if (errorLog[name]) continue
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }
  // add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

async function validateFormField(form, formValues, name) {
  try {
    // clear previous errors
    setFieldValues(form, name, '')
    const schema = getPostSchema()
    await schema.validateAt(name, formValues)
  } catch (error) {
    setFieldError(form, name, error.message)
  }
  // show validation error (if any)
  const field = form.querySelector(`[name="${name}"]`)
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated')
  }
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.innerHTML = '<i class="fas fa-save mr-1"></i> Save'
  }
}

function initRandomImage(form) {
  const button = document.getElementById('postChangeImage')
  if (!button) return
  button.addEventListener('click', () => {
    const urlImage = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`
    setFieldValues(form, '[name="imageUrl"]', urlImage) // hidden field
    setBackgroundImage(document, '#postHeroImage', urlImage)
  })
}

function renderOptionSource(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initChangeSetBackground(form) {
  const button = form.querySelectorAll('[name="imageSource"]')
  if (!button) return
  button.forEach((radio) => {
    radio.addEventListener('change', (event) => renderOptionSource(form, event.target.value))
  })
}

function setBackgroundUpload(form) {
  const imageUpload = form.querySelector('[name="image"]')
  if (!imageUpload) return

  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0]
    if (file) {
      const uploadImageUrl = URL.createObjectURL(file)
      setBackgroundImage(document, '#postHeroImage', uploadImageUrl)
      // trigger validation of upload input
      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file, }, 'image')
    }
  })
}

function initValidationOnChange(form) {
  ;['title', 'author'].forEach((name) => {
    const element = form.querySelector(`[name="${name}"]`)
    if (element) {
      element.addEventListener('input', (event) => {
        const newValue = event.target.value
        validateFormField(form, { [name]: newValue }, name)
      })
    } 
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return
  let submitting = false
  setFormValues(form, defaultValues)
  // init event
  initRandomImage(form)
  initChangeSetBackground(form)
  setBackgroundUpload(form)
  initValidationOnChange(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    // prevent other submission
    // show loading/ disabled Button
    if (submitting) return
    showLoading(form)
    submitting = true
    // get form formValues
    const formValues = getFormValues(form)
    formValues.id = defaultValues.id
    // validation
    // if valid trigger submit callback
    // ptjerwise, show validation errors
    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    hideLoading(form)
    submitting = false
  })
}
