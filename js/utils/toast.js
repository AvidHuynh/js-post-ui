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
        background: '#4fc3f7',
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
        background: '#e57373',
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
        background: '#81c784',
      },
    }).showToast()
  },
}

