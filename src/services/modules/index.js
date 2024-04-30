import request from '@/services/request/index.js'

export function getDemoListApi(page, pageSize) {
  return request.get({
    url: '/table/getDemoList',
    params: {
      page,
      pageSize,
    },
  })
}
