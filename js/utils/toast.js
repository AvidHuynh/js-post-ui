import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 2000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#0288d1',
      },
    }).showToast()
  },
  error(message) {
    Toastify({
      text: message,
      duration: 2000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#d32f2f',
      },
    }).showToast()
  },
  success(message) {
    Toastify({
      text: message,
      duration: 2000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      style: {
        background: '#388e3c',
      },
    }).showToast()
  },
}

