import { request } from '@/utils/request'

export function collectionSheetSize() {
  return request({
    url: '/api/mongo/collectionSheetSize',
    method: 'get'
  })
}

export function collectionSheetFields(params) {
  return request({
    url: '/api/mongo/collectionSheetFields',
    method: 'get',
    params: params
  })
}