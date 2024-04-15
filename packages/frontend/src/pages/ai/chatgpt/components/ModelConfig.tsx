import TitleComponent from '@/components/title/TitleComponent'
import {
  DEFAULT_MODEL,
  DEFAULT_MODEL_TYPE,
  OPTIONIAL_MODEL
} from '@/constants/constant'
import {
  ILocalSettings,
  IModelInfo,
  getSettingData,
  setSettingData
} from '@/utils/store'
import { randomString } from '@/utils/tools'
import { InfoCircleOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd'
import { debounce } from 'lodash-es'

interface IModelConfigProps {
  onCancel: () => void
  data?: IModelInfo
}

export default function ModelConfig(props: IModelConfigProps) {
  const formRef = useRef<FormInstance<IModelInfo>>(null)
  const [form] = Form.useForm()
  const [modelType, setModelType] = useState(
    props.data?.modelType || DEFAULT_MODEL_TYPE
  )
  const [id, setId] = useState(props.data?.id || randomString())
  const initData: Omit<IModelInfo, 'id' | 'modelType'> = {
    baseUrl: props.data?.baseUrl || '',
    apiKey: props.data?.apiKey || '',
    model: props.data?.model || DEFAULT_MODEL,
    temperature: props.data?.temperature ?? 0.8,
    top_p: props.data?.top_p ?? 1
  }

  const selectOptions = OPTIONIAL_MODEL.map((m) => {
    return {
      label: <span>{m.label}</span>,
      value: m.label,
      title: m.label,
      options: m.children.map((o) => {
        return {
          label: o.label,
          value: o.label
        }
      })
    }
  })

  const submit = (formData: IModelInfo) => {
    console.log('submit', formData)
    const info: IModelInfo = {
      ...formData,
      id: id || props.data?.id || randomString(),
      modelType: modelType || props.data?.modelType || DEFAULT_MODEL_TYPE
    }
    const setting = getSettingData()
    if (setting && (setting as ILocalSettings)?.models) {
      const models = (setting as ILocalSettings)?.models
      let target
      if ((target = models.find((m) => m.id === info.id))) {
        Object.assign(target, info)
      } else {
        models.push(info)
      }
      setSettingData({
        ...(setting as ILocalSettings),
        models
      })
    } else {
      setSettingData({
        ...((setting as ILocalSettings) || {}),
        models: [info]
      })
    }
    _message.success('保存成功')
  }

  const submitError = (errorInfo: any) => {
    _message.error(errorInfo)
  }

  const saveHandler = debounce(
    () => {
      formRef.current?.submit()
    },
    500,
    {
      trailing: true,
      leading: false
    }
  )

  const findGroupByValue = (
    value: string,
    optionsData: typeof OPTIONIAL_MODEL
  ) => {
    for (let group of optionsData) {
      if (group.children.find((option) => option.label === value)) {
        return group.label
      }
    }
    return ''
  }

  const selectModelHandler = (
    value: string,
    option: (typeof selectOptions)[0]
  ) => {
    console.log('selectModelHandler', value, option)
    setModelType(findGroupByValue(value, OPTIONIAL_MODEL))
    saveHandler()
  }

  const check = () => {}

  return (
    <Form
      className='w-full'
      name={props.data?.id || 'setting'}
      layout='horizontal'
      ref={formRef}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16, offset: 2 }}
      initialValues={initData}
      onFinish={submit}
      onFinishFailed={submitError}
    >
      <Form.Item label='model' name='model'>
        <Select options={selectOptions} onSelect={selectModelHandler}></Select>
      </Form.Item>
      <Form.Item label='baseUrl' name='baseUrl'>
        <Input
          placeholder='不填值时使用系统默认baseUrl'
          onChange={saveHandler}
        />
      </Form.Item>
      <Form.Item label='apiKey' name='apiKey'>
        <Input placeholder='不填值时使用系统默认key' onChange={saveHandler} />
      </Form.Item>
      <Form.Item
        label='temperature'
        name='temperature'
        tooltip={{
          title: (
            <TitleComponent
              title={
                '可选，默认是1。<br/>使用哪个采样温度，在0和2之间。较高的值，如0.8会使输出更随机，而较低的值，如0.2会使其更加集中和确定性。<br/>我们通常建议更改此参数或 top_p 参数，但不要同时更改两者。'
              }
              split={'<br/>'}
            />
          ),
          // overlayClassName: styles.tooltip,
          icon: <InfoCircleOutlined />
        }}
      >
        <Slider min={0} max={2} step={0.1} onChange={saveHandler}></Slider>
      </Form.Item>
      <Form.Item
        label='top_p'
        name='top_p'
        tooltip={{
          title: (
            <TitleComponent
              title={
                '可选，默认是1。<br/>一种替代temperature采样的方法叫做核心采样，模型考虑具有 top_p 概率质量的标记结果。因此，0.1 表示仅考虑组成前 10% 概率质量的标记。<br/>我们通常建议更改此参数或 temperature 参数，但不要同时更改两者。'
              }
              split={'<br/>'}
            />
          ),
          // overlayClassName: styles.tooltip,
          icon: <InfoCircleOutlined />
        }}
      >
        <Slider min={0} max={1} step={0.1} onChange={saveHandler}></Slider>
      </Form.Item>
      {props.data ? (
        <Form.Item label='联通性检查'>
          <Button type='primary' onClick={check}>
            检查
          </Button>
        </Form.Item>
      ) : null}
    </Form>
  )
}
