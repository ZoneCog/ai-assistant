import debugLibrary from 'debug'
import { EventEmitter } from 'events'
import Koa from 'koa'
import { deleleStore } from '../utils/store.mjs'

import { flowResponse } from '../service/stream.mjs'

const debug = debugLibrary('controller:completions')
const events = new EventEmitter()
events.setMaxListeners(0)

export interface ISSEQuery {
  msg: string
  ownerId?: string
  parentMessageId?: string
  conversationId?: string
  model?: string
  baseUrl?: string
  apiKey?: string
  temperature?: string
  top_p?: string
  sessionId: string
}

export default class MessageController {
  /**
   * 获取chatgpt的消息的sse
   * @param ctx
   */
  public static async sendMsgSSE(ctx: Koa.Context) {
    const query = ctx.request.query as unknown as ISSEQuery
    debug('sendMsgSSE query params:', JSON.stringify(ctx.request.query))

    flowResponse(query, ctx, events)
  }

  public static async delStore(ctx: Koa.Context) {
    const id = ctx.params.id
    debug('delStore id:', id)
    if (!id) {
      ctx.body = {
        code: 500,
        msg: 'id不能为空',
        data: null
      }
      return
    }
    deleleStore(id)
    ctx.body = {
      code: 200,
      msg: 'ok',
      data: null
    }
  }
}
