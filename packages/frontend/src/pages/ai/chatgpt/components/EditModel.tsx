import { Button, CollapseProps } from 'antd'
import { ILocalSettings, getSettingData } from '@/utils/store'
import ModelConfig from './ModelConfig'
import CompanyIcon from '@/components/icons/CompanyIcon'

interface AddModelProps {
  onCancel: () => void
  onCreateModel: (type: 'createModel' | 'editModel') => void
}

export default function AddModel(props: AddModelProps) {
  const models = (getSettingData() as ILocalSettings)?.models ?? []
  const items: CollapseProps['items'] = models.map((m) => {
    return {
      key: m.id,
      label: (
        <div className='flex items-center'>
          <CompanyIcon
            className='w-20px h-20px mr-5px'
            type={m.modelType as 'chatgpt' | 'gemini'}
          ></CompanyIcon>
          <span>{m.modelType}</span>
        </div>
      ),
      children: <ModelConfig onCancel={props.onCancel} data={m} />
    }
  })

  const defaultActiveKey = [models[0].id]

  function createModel() {
    props.onCreateModel('createModel')
  }

  return (
    <div className='h-full flex flex-col items-stretch'>
      <div className='flex-1'>
        {items.length > 0 ? (
          <Collapse
            items={items}
            defaultActiveKey={defaultActiveKey}
          ></Collapse>
        ) : (
          <Empty
            description={
              <Button type='link' onClick={createModel}>
                去创建模型
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}
