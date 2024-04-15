import { ILocalSettings, IModelInfo, getSettingData } from '@/utils/store'
import { PlusOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd'
import { forEach, groupBy } from 'lodash-es'

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
      label: <span>{k}</span>,
      key: k,
      type: 'group',
      children: v.map((m) => {
        return {
          label: (
            <div>
              <span className='text-16px mr-4px'>{m.model}</span>
              <span className='text-12px text-gray-500'>{m.baseUrl}</span>
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

  return (
    <Dropdown menu={menu} trigger={['click']}>
      <Tooltip title={modelInfo ? TipModel : ''} placement='right'>
        <Tag
          className='flex-inline items-center cursor-pointer'
          icon={
            <div className='i-material-symbols-robot-2-outline w-12px h-12px mr-7px'></div>
          }
          color='#2db7f5'
        >
          {modelInfo ? <span>{modelInfo.model}</span> : '请选择模型'}
        </Tag>
      </Tooltip>
    </Dropdown>
  )
}
