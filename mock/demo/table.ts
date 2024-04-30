// mock.js 文件
import Mock from 'mockjs' // 引入mockjs
import type { MockMethod } from 'vite-plugin-mock'
import { resultPageSuccess } from '../_util'

const Random = Mock.Random // Mock.Random 是一个工具类，用于生成各种随机数据

interface DataList {
  date: string
  name: string
  address: string
}

const demoList = ((): DataList[] => {
  const dataList: DataList[] = [] // 用于接受生成数据的数组
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
// list 分页接口()

export default [
  {
    url: '/api/table/getDemoList',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query
      return resultPageSuccess(page, pageSize, demoList)
    },
  },
] as MockMethod[]
