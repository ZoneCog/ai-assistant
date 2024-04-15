import ModelConfig from './ModelConfig'

interface AddModelProps {
  onCancel: () => void
}

export default function AddModel(props: AddModelProps) {
  return (
    <div className='h-full flex flex-col items-stretch'>
      <div className='flex-1'>
        <ModelConfig onCancel={props.onCancel} />
      </div>
    </div>
  )
}
