import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    const url = '/posts'
    return axiosClient.get(url, { params })
  },
  getByID(id) {
    const url = `/posts/${id}`
    return axiosClient.get(url)
  },
  add(data) {
    const url = '/posts'
    return axiosClient.post(url, data) 
  },
  update(data) {
    const url = '/posts'
    return axiosClient.patch(url, data)
  },
  remove(id) {
    const url = `/post/${data.id}`
    return axiosClient.delete(url)
  },
}
export default postApi
