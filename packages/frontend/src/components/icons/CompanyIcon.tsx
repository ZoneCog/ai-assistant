import clsx from 'clsx'

interface ICompanyIconProps {
  className?: string
  type?: 'chatgpt' | 'gemini'
}

export default function CompanyIcon({ className, type }: ICompanyIconProps) {
  switch (type) {
    case 'chatgpt':
      return <span className={clsx('i-logos-openai-icon', className)}></span>
    case 'gemini':
      return <span className={clsx('i-ion-logo-google', className)}></span>
    default:
      return <span className={clsx('i-logos-openai-icon', className)}></span>
  }
}
