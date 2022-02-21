import axiosClient from './api/axiosClient'

async function main() {
  const response = await axiosClient.get('/posts')
  console.log(response)
}

main()
