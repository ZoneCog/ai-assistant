import { ChatMessage } from 'chatgpt'
import Keyv from 'keyv'
import QuickLRU from 'quick-lru'

const mapStore = new Map<string, Keyv<ChatMessage, any>>()

const getStore = (key: string) => {
  if (!mapStore.has(key)) {
    mapStore.set(
      key,
      new Keyv<ChatMessage, any>({
        store: new QuickLRU<string, ChatMessage>({ maxSize: 10000 })
      })
    )
  }
  return mapStore.get(key)
}

const deleleStore = (key: string) => {
  mapStore.delete(key)
}

export { getStore, deleleStore }
