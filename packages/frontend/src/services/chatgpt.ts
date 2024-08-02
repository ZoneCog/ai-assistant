import { ENABLE_REQUEST_STREAM } from '@/constants/request'
import { post, del, get } from '@/utils/request'
import { ChatMessage } from 'chatgpt'

export interface MsgData {
  msg: string
  ownerId: string
  parentMessageId: string
}

export type ICheckApiParams = {
  baseUrl: string
  apiKey: string
  temperature: string
  top_p: string
  model: string
  msg: string
}

export const CHATGPT = {
  sendMsg: async (data: MsgData): Promise<ChatMessage> => {
    const res = await post<ChatMessage, MsgData>('/q/sendMsg', data, {
      responseType: (ENABLE_REQUEST_STREAM ? 'stream' : 'json') as ResponseType,
      getResponse: true
    })
    console.log('chatgpt - /q/sendMsg:', res)
    return res
  },
  deleleStore: async (id: string): Promise<any> => {
    const res = await del<any>(`/q/del/${id}`)
    console.log('chatgpt - /q/del:', res)
    return res
  },
  checkApi: async (params: ICheckApiParams): Promise<ChatMessage> => {
    const res = await get<ChatMessage, ICheckApiParams>('/q/checkApi', params)
    console.log('chatgpt - /q/checkApi:', res)
    return res
  },
  queryApi2DBill: async (): Promise<any> => {
    const res = await post<any>('/q/userProfile/api2d')
    console.log('chatgpt - /q/userProfile/api2d:', res)
    return res
  }
}
