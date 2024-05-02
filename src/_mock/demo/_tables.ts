import Mock from 'mockjs' // 引入mockjs
import { HttpResponse, http } from 'msw'
import { resultPageSuccess } from '../_utils'

const Random = Mock.Random // Mock.Random 是一个工具类，用于生成各种随机数据

const demoList = (() => {
  const dataList = [] // 用于接受生成数据的数组
  for (let i = 0; i < 100; i++) { // 可自定义生成的个数
    const template = {
      date: Random.date(), // 生成一个随机日期,可加参数定义日期格式
      name: Random.name(), // 生成姓名
      address: Random.province(), // 生成地址
    }
    dataList.push(template)
  }
  return dataList // 返回生成的数据
})()

const getDemoList = http.get('/api/table/getDemoList', ({ request }) => {
  const url = new URL(request.url)
  const page = url.searchParams.get('page') || 1
  const pageSize = url.searchParams.get('pageSize') || 10
  return HttpResponse.json(resultPageSuccess(Number(page), Number(pageSize), demoList))
})

export default [getDemoList]
