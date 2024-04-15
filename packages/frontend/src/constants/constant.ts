export const CHATGPT_KEY = 'chatgpt__data'
export const CONVASITION_CHATGPT_KEY = 'convasition_chatgpt__data'
export const SETTINGS_CHATGPT_KEY = 'setting_chatgpt__data'
export const WEEK_REPORT_CHATGPT_KEY = 'week-report_chatgpt__data'
export const DEFAULT_MODEL = 'gpt-3.5'
export const DEFAULT_MODEL_TYPE = 'chatgpt'
export const OPTIONIAL_MODEL = [
  {
    label: 'chatgpt',
    children: [
      {
        label: 'gpt-3.5-turbo'
      },
      {
        label: 'gpt-4'
      }
    ]
  },
  {
    label: 'gemini',
    children: [
      {
        label: 'gemini-1.0'
      },
      {
        label: 'gemini-1.5'
      }
    ]
  }
]
