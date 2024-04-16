import { findLast } from 'lodash-es'

export function getTitle(item: IConvasition) {
  if (item.isLoading) {
    return '查询中...'
  } else if (item.isInput) {
    return '输入中...'
  } else {
    return (
      findLast(item.data, (d) => d.type === 'question')?.content || item.title
    )
  }
}

export function getStableTitle(item: IConvasition | null) {
  if (!item) return ''
  if (item.isLoading || item.isInput) {
    return item.title
  } else {
    return (
      findLast(item.data, (d) => d.type === 'question')?.content || item.title
    )
  }
}

export function getChatAIType(type: string) {
  switch (type) {
    case 'gpt-3.5-turbo':
      return 'blue'
    case 'gpt-4':
      return 'green'
    case 'gemini-1.0':
      return 'gold'
    case 'gemini-1.5':
      return 'orange'
    default:
      return 'gray'
  }
}
