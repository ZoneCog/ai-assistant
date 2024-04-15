import AddModel from './AddModel'
import EditModel from './EditModel'

interface SettingModalProps {
  type: 'createModel' | 'editModel'
  open: boolean
  setOpen: (open: boolean) => void
  setType: (type: 'createModel' | 'editModel') => void
}

export default function SettingModal(props: SettingModalProps) {
  const cancel = () => {
    props.setOpen(false)
  }

  return (
    <Drawer
      title='ChatGPT 配置'
      placement='left'
      open={props.open}
      width={600}
      destroyOnClose={false}
      onClose={() => props.setOpen(false)}
    >
      {props.type === 'createModel' ? (
        <AddModel onCancel={cancel} />
      ) : (
        <EditModel onCancel={cancel} onCreateModel={props.setType} />
      )}
    </Drawer>
  )
}
