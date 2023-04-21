import WaveLoading from '@/components/loading/WaveLoading'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './answerLayout.less'

type AnswerLayoutProps = {
  data: Answer.answer[]
  inputing: boolean
}

export default function AnswerLayout(props: AnswerLayoutProps) {
  const ref = useRef<HTMLDivElement>(null)
  const stylesName = {
    question: styles.questionType,
    answer: styles.answerType,
    loading: styles.loadingType
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  })

  function generateContent(obj: Answer.answer, index: number) {
    if (obj.type === 'answer') {
      const paragraph = obj.content.split(/(\n|\r|\r\n)/)
      return paragraph.map((o, i) => (
        <p
          className={clsx(
            obj.error ? styles.answerError : '',
            props.inputing &&
              i === paragraph.length - 1 &&
              index === props.data.length - 1
              ? 'cursor-blingking'
              : ''
          )}
          key={i}
        >
          {/^\s$/.test(o) ? '' : o.replace(/\s/g, ' ')}
        </p>
      ))
    } else if (obj.type === 'question') {
      return obj.content
    } else if (obj.type === 'loading') {
      return <WaveLoading style={{ top: '6px' }} />
    }
  }

  function generateContentWrap(obj: Answer.answer, index: number) {
    if (obj.type === 'answer' || obj.type === 'question') {
      return (
        <>
          <div className={styles.triangle}></div>
          {generateContent(obj, index)}
        </>
      )
    } else if (obj.type === 'loading') {
      return generateContent(obj, index)
    }
  }

  return (
    <div className={styles.container} ref={ref}>
      <ul className={styles.ul}>
        {props.data.map((item, index) => {
          return (
            <li key={item.id} className={styles.answerItem}>
              <div
                className={clsx(
                  styles.answerItemContent,
                  stylesName[item.type]
                )}
              >
                <span className={styles.logo}>
                  {item.type === 'question' && <span>我</span>}
                </span>
                <div className={styles.content}>
                  {generateContentWrap(item, index)}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
