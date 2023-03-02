import { request } from '@/utils/request'

export function getTasks() {
  return request({
    url: '/api/task/list',
    method: 'get'
  })
}

export function getTask(params) {
  return request({
    url: `/api/task/list`,
    method: 'get',
    params: params
  })
}
