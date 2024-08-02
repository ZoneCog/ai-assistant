// 运行时配置
import { RequestConfig } from '@umijs/max'
import type { RequestOptions } from '@@/plugin-request/request'

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' }
}

export const request: RequestConfig = {
  // charset: 'utf8',
  timeout: 2 * 60 * 1000,
  // credentials: 'include',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  requestInterceptors: [
    (config: RequestOptions) => {
      console.log('requestInterceptors')
      // 拦截请求配置，进行个性化处理。
      if (config.method === 'GET') {
        config.params = Object.assign(config.params, {
          _: new Date().getTime()
        })
      }
      if (config.method === 'post') {
        if (!config.headers?.['Content-Type']) {
          config.headers!['Content-Type'] = 'application/json'
        }
      } else {
        config.headers!['Content-Type'] = 'application/json'
      }
      return config
    }
  ],
  // 响应拦截器
  responseInterceptors: [
    (response) => {
      console.log('responseInterceptors')
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as Common.Response<any>
      if (data.code === 200) {
        return data.data
      } else {
        return Promise.reject(data)
      }
    }
  ]
}
