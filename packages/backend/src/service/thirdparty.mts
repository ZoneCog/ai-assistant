import { ChatGPTAPI, ChatGPTUnofficialProxyAPI, ChatMessage } from 'chatgpt'
import debugLibrary from 'debug'
import proxy from 'https-proxy-agent'
import { isNil } from 'lodash-es'
import fetchApi from 'node-fetch'
import { getStore } from '../utils/store.mjs'

import { ISSEQuery } from '../controller/message.mjs'
import { hashString } from '../utils/util.mjs'

const debug = debugLibrary('service:thirdparty')
const chatgptApiMap = new Map<string, ChatGPTAPI>()

export type IType = 'flow-convasition' | 'check-api'

const getRestOptions = ({ parentMessageId }: { parentMessageId: string }) => {
  return {
    parentMessageId
  }
}

export async function responseChatgpt(
  query: ISSEQuery,
  callbacks: IResponseChatGptCallbacks = {},
  type: IType = 'flow-convasition'
) {
  const {
    msg,
    ownerId,
    parentMessageId,
    model,
    baseUrl,
    apiKey,
    temperature,
    top_p,
    sessionId
  } = query
  let chatOption = {
    apiBaseUrl: baseUrl,
    apiKey: apiKey,
    completionParams: {
      model: model,
      temperature: isNil(temperature) ? 0.8 : +temperature,
      top_p: isNil(top_p) ? 1 : +top_p
    },
    fetch: process.env.CUSTOM_PROXY
      ? (url, options = {}) => {
          const defaultOptions = {
            agent: proxy(process.env.CUSTOM_PROXY)
          }
          const mergedOptions = {
            ...defaultOptions,
            ...options
          }
          // @ts-ignore
          return fetchApi(url, mergedOptions)
        }
      : undefined,
    ...(type === 'flow-convasition'
      ? { messageStore: getStore(sessionId) }
      : {})
  }
  debug('...chatOption: %o', chatOption)

  const { fetch, messageStore, ...modelHash } = chatOption
  // const { fetch, ...modelHash } = chatOption
  const modelHashKey = hashString(modelHash)
  let api: ChatGPTAPI | null = null
  if (!chatgptApiMap.get(modelHashKey) && type === 'flow-convasition') {
    // @ts-ignore
    chatgptApiMap.set(modelHashKey, new ChatGPTAPI(chatOption))
  }
  if (type === 'flow-convasition') {
    api = chatgptApiMap.get(modelHashKey)
  } else if (type === 'check-api') {
    // @ts-ignore
    api = new ChatGPTAPI(chatOption)
  }
  if (!api) {
    throw new Error('api is null')
  }
  try {
    debug('...input messages: %o', msg)
    // @ts-ignore
    const result = await api.sendMessage(msg, {
      ...(type === 'flow-convasition'
        ? {
            onProgress: (partialResponse: ChatMessage) => {
              callbacks.onData?.(partialResponse)
            }
          }
        : {}),
      timeoutMs:
        type === 'flow-convasition'
          ? +process.env.REQUEST_TIMEOUT
          : +process.env.CHECK_REQUEST_TIMEOUT,
      ...getRestOptions({
        parentMessageId
      })
    })
    callbacks.onEnd?.(result)
    return Promise.resolve(result)
  } catch (e) {
    callbacks.onError?.(e)
    return Promise.reject(e)
  }
}
