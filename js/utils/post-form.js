import { setFieldValues, setBackgroundImage, setTextContent } from './commons'
import * as yup from 'yup'
import { toast } from './toast'

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
  })
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))
    // start validating
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
    // trường hợp không có error thì sẽ chuyển tới bước dòng isValid
  } catch (error) {
    toast.error(`Error: ${error.message}`)
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

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false
  setFormValues(form, defaultValues)

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
    if (!isValid) return
    await onSubmit?.(formValues)
    hideLoading(form)
    submitting = false
  })
}
