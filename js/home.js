import postApi from './api/postAPI'
import { renderPostList, renderPagination, initPagination, initSearch } from './utils'
import { toast } from './utils/toast'

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    if (filterName) url.searchParams.set(filterName, filterValue)
    // history.pushState là để cập nhật lại query parmas lên url mới nhất và có thể bấm nút back trên trình duyệt
    history.pushState({}, '', url)
    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList('postList', data)
    renderPagination('Pagination', pagination)
  } catch (error) {
    console.log('error filter change', error)
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail
      const message = `Are you remove post ${post.title}`
      if (window.confirm(message)) {
        await postApi.remove(post.id)
        await handleFilterChange()

        toast.success('Remove post success!')
      }
    } catch (error) {
      console.log('Fail to remove post', error)
      toast.error(error.message)
    }
  })
}

;(async () => {
  // Call ANI
  try {
    const url = new URL(window.location)

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)
    history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination({
      elementId: 'Pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    
    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    registerPostDeleteEvent()
    handleFilterChange()
  } catch (error) {
    console.log('get all failed', error)
  }
})()
