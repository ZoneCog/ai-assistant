import { EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, MenuProps } from 'antd'
import clsx from 'clsx'
import { SyntheticEvent } from 'react'

import { ChatContext } from './LayoutIndex'
import AccountModal from './components/AccountModal'
import styles from './layoutSider.less'
import { getTitle } from './chat.util'
import { CHATGPT } from '@/services/chatgpt'

interface IOperateMenu {
  items: MenuProps['items']
  onClick: MenuProps['onClick']
}

export default function LayoutSider() {
  const {
    result,
    addResult,
    deleteResult,
    toggleActive,
    getActiveResult,
    setOpenSetting,
    setModeType
  } = useContext(ChatContext)
  const [openAccount, setOpenAccount] = useState(false)

  const operateMenu: IOperateMenu = {
    items: [
      {
        label: '添加模型',
        key: 'createModel',
        icon: <PlusOutlined />
      },
      {
        label: '编辑模型',
        key: 'editModel',
        icon: <EditOutlined />
      }
    ],
    onClick: ({ key }) => {
      setModeType(key as 'createModel' | 'editModel')
      setOpenSetting(true)
    }
  }

  function deleteItem(item: IConvasition) {
    return (e: SyntheticEvent) => {
      e.stopPropagation()
      deleteResult(item.sessionId)
      CHATGPT.deleleStore(item.sessionId)
    }
  }

  function addResultHandler() {
    const target = getActiveResult()
    // 数据正在请求或输入中，请稍后再添加新回话
    if (target?.isLoading || target?.isInput) {
      window.alert('数据正在请求或输入中，请稍后再添加新回话')
      return
    }
    addResult()
  }

  function toggle(sessionId: string) {
    return (e: SyntheticEvent) => {
      e.stopPropagation()
      const target = result.find((r) => r.sessionId === sessionId)
      // 点击当前激活页面，不做任何操作
      if (target?.active) return
      // 正在加载中的或者正在输入中的页面，不允许切换
      if (target?.isLoading || target?.isInput) {
        window.alert('正在加载中或者正在输入中，不能切换')
        return
      }
      toggleActive(sessionId)
    }
  }

  return (
    <>
      <div className={styles.layoutAiSlider}>
        <div className={styles.topDiv}>
          <button type='button' onClick={addResultHandler}>
            + 添加新会话
          </button>
        </div>
        <div className={clsx(styles.content)}>
          <ul className={styles.menusUl}>
            {result
              .slice()
              .reverse()
              .map((item) => {
                return (
                  <li
                    className={clsx(styles.menusLi, {
                      [styles.active]: item.active
                    })}
                    key={item.sessionId}
                    onClick={toggle(item.sessionId)}
                  >
                    <div className='i-ep-chat-line-square mr-8px'></div>
                    <div className={styles.liTitle}>{getTitle(item)}</div>

                    <div
                      className='i-mingcute-delete-2-line cursor-pointer'
                      onClick={deleteItem(item)}
                    ></div>
                  </li>
                )
              })}
          </ul>
        </div>
        <div className={styles.bottomDiv}>
          <Dropdown
            menu={operateMenu}
            placement='top'
            arrow
            trigger={['click']}
          >
            <Button
              type='default'
              shape='default'
              icon={<SettingOutlined />}
              size='middle'
              flex-1=''
              style={{
                marginBottom: '0px'
              }}
            >
              设置
            </Button>
          </Dropdown>
        </div>
      </div>
      <AccountModal open={openAccount} setOpen={setOpenAccount}></AccountModal>
    </>
  )
}
