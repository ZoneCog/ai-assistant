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
