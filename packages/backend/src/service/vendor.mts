import { Context } from 'koa'
import fetch from 'node-fetch'
import proxy from 'https-proxy-agent'
import debugLibrary from 'debug'

const debug = debugLibrary('vendor')

export async function api2DProfile(ctx: Context) {
  try {
    const res = await fetch(
      `${process.env.VENDOR_api2d_net_url}${process.env.VENDOR_api2d_net_userProfileUrl}`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${process.env.VENDOR_api2d_net_apiToken}`,
          Accept: 'application/json'
        },
        agent: proxy(process.env.CUSTOM_PROXY)
      }
    )
    const data: any = await res.json()
    debug('api2DProfile result: ', data)
    if (data.code === 0) {
      ctx.body = {
        code: 200,
        msg: 'ok',
        data: data.data.profile,
        success: true
      }
    } else {
      ctx.body = {
        code: 500,
        msg: data.msg || 'error',
        data: data,
        success: false
      }
    }
  } catch (e) {
    debug('api2DProfile error: ', e)
    ctx.body = {
      code: 500,
      msg: e.message || 'error',
      data: null,
      success: false
    }
  }
}
