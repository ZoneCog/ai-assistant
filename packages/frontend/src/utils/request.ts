import { request } from '@umijs/max'
import { v4 as uuid } from 'uuid'

type IMethod = 'POST' | 'GET' | 'DELETE'

async function http<ResponseData, RequestData>(
  url: string,
  method: IMethod,
  params?: RequestData,
  config?: any
) {
  const data = await request<ResponseData>(url, {
    method,
    headers: {
      'X-Trace-Id': uuid()
    },
    ...(method === 'GET' ? { params } : { data: params }),
    getResponse: false,
    config
  })

  return data
}

function get<ResponseData, RequestData = undefined>(
  url: string,
  params?: RequestData,
  config: any = {}
): Promise<ResponseData> {
  return http<ResponseData, RequestData>(url, 'GET', params, config)
}

function post<ResponseData, RequestData = undefined>(
  url: string,
  data?: RequestData,
  config?: any
): Promise<ResponseData> {
  return http<ResponseData, RequestData>(url, 'POST', data, config)
}

function del<ResponseData, RequestData = undefined>(
  url: string
): Promise<ResponseData> {
  return http<ResponseData, RequestData>(url, 'DELETE')
}

export { get, post, del }
