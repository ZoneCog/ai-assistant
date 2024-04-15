import { ENABLE_REQUEST_STREAM } from '@/constants/request'
import { post, del } from '@/utils/request'
import { ChatMessage } from 'chatgpt'

export interface MsgData {
  msg: string
  ownerId: string
  parentMessageId: string
}

export const CHATGPT = {
  sendMsg: async (data: MsgData): Promise<Common.Response<ChatMessage>> => {
    const res = await post<ChatMessage, MsgData>('/q/sendMsg', data, {
      responseType: (ENABLE_REQUEST_STREAM ? 'stream' : 'json') as ResponseType,
      getResponse: true
    })
    console.log('chatgpt - /q/sendMsg:', res)
    return res
  },
  deleleStore: async (id: string): Promise<Common.Response<any>> => {
    const res = await del<any>(`/q/del/${id}`)
    console.log('chatgpt - /q/del:', res)
    return res
  }
}
