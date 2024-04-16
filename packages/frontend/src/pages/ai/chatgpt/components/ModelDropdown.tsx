import { ILocalSettings, IModelInfo, getSettingData } from '@/utils/store'
import { PlusOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd'
import clsx from 'clsx'
import { forEach, groupBy } from 'lodash-es'
import { getChatAIType } from '../chat.util'

type IModelDropdownProps = {
  modelId?: string
  onCreateModel: () => void
  OnChangeModel: (id: string) => void
}

function getModelInfo(id: string | undefined | null) {
  if (!id) return null
  const settings = getSettingData() as ILocalSettings
  return settings?.models.find((m) => m.id === id) ?? null
}

export default function ModelDropdown(props: IModelDropdownProps) {
  const [modelInfo, setModelInfo] = useState<IModelInfo | null>(() =>
    getModelInfo(props.modelId)
  )

  const models = groupBy(
    (getSettingData() as ILocalSettings)?.models ?? [],
    'modelType'
  )

  const items: MenuProps['items'] = []

  forEach(models, (v, k) => {
    items.push({
      label: (
        <div className='flex items-center'>
          {k === 'chatgpt' ? (
            <div className='i-logos-openai-icon?mask w-12px h-12px mr-4px text-gray-500'></div>
          ) : (
            <div className='i-ion-logo-google w-12px h-12px mr-7px'></div>
          )}
          <span>{k}</span>
        </div>
      ),
      key: k,
      type: 'group',
      children: v.map((m) => {
        return {
          label: (
            <div className='flex items-center'>
              <Tag color={getChatAIType(m.model)} bordered={false}>
                {m.model}
              </Tag>
              <span
                className={clsx(
                  m.id === props.modelId ? 'text-[#2db7f5] font-semibold' : '',
                  'text-16px mr-4px'
                )}
              >
                {m.baseUrl}
              </span>
              {/* <span className='text-12px text-gray-500'>{m.model}</span> */}
            </div>
          ),
          key: m.id!,
          onClick: () => {
            console.log('click', m.model)
          }
        }
      })
    })
  })

  const EmptyItems: MenuProps['items'] = [
    {
      label: '模型还未创建，请点击创建模型',
      key: 'createModel',
      icon: <PlusOutlined />
    }
  ]

  const clickHandler: MenuProps['onClick'] = ({ key }) => {
    console.log('click', key)
    if (key === 'createModel') {
      props.onCreateModel()
    } else {
      props.OnChangeModel(key)
    }
  }

  const menu = {
    items: items.length ? items : EmptyItems,
    onClick: clickHandler
  }

  useEffect(() => {
    setModelInfo(getModelInfo(props.modelId))
  }, [props.modelId])

  function TipModel() {
    return (
      <div className='flex flex-col items-stretch'>
        <div>
          <span>模型名称：</span>
          <span>{modelInfo?.model}</span>
        </div>
        <div>
          <span>模型类型：</span>
          <span>{modelInfo?.modelType}</span>
        </div>
        <div>
          <span>模型地址：</span>
          <span>{modelInfo?.baseUrl}</span>
        </div>
      </div>
    )
  }

  function IconPrefix() {
    switch (modelInfo?.modelType) {
      case 'chatgpt':
        return (
          <div className='i-logos-openai-icon?mask w-12px h-12px mr-7px text-white'></div>
        )
      case 'gemini':
        return <div className='i-ion-logo-google w-12px h-12px mr-7px'></div>
      default:
        return (
          <div className='i-material-symbols-robot-2-outline w-12px h-12px mr-7px'></div>
        )
    }
  }

  return (
    <Dropdown menu={menu} trigger={['click']}>
      <Tooltip title={modelInfo ? TipModel : ''} placement='right'>
        <Tag
          className='flex-inline items-center cursor-pointer'
          icon={<IconPrefix></IconPrefix>}
          color='#2db7f5'
        >
          {modelInfo ? <span>{modelInfo.baseUrl}</span> : '请选择模型'}
        </Tag>
      </Tooltip>
    </Dropdown>
  )
}
