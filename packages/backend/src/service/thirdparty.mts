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

const getRestOptions = ({ parentMessageId }: { parentMessageId: string }) => {
  return {
    parentMessageId
  }
}

export async function responseChatgpt(
  query: ISSEQuery,
  callbacks: IResponseChatGptCallbacks = {}
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
    apiBaseUrl:
      baseUrl || process.env.OPENAI_API_BASE_URL || 'https://api.openai.com',
    apiKey: apiKey || process.env.OPENAI_API_KEY,
    completionParams: {
      model: model || 'gpt-3.5-turbo',
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
    messageStore: getStore(sessionId)
  }
  debug('...chatOption: %o', chatOption)

  const { fetch, messageStore, ...modelHash } = chatOption
  // const { fetch, ...modelHash } = chatOption
  const modelHashKey = hashString(modelHash)
  let api: ChatGPTAPI | null = null
  if (!chatgptApiMap.get(modelHashKey)) {
    // @ts-ignore
    chatgptApiMap.set(modelHashKey, new ChatGPTAPI(chatOption))
  }
  api = chatgptApiMap.get(modelHashKey)
  if (!api) {
    throw new Error('api is null')
  }
  try {
    debug('...input messages: %o', msg)
    // @ts-ignore
    const result = await api.sendMessage(msg, {
      onProgress: (partialResponse: ChatMessage) => {
        callbacks.onData?.(partialResponse)
      },
      timeoutMs: +process.env.CHATGPT_REQUEST_TIMEOUT,
      ...getRestOptions({
        parentMessageId
      })
    })
    callbacks.onEnd?.(result)
  } catch (e) {
    callbacks.onError?.(e)
  }
}
