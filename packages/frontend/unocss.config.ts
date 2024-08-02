import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerAttributifyJsx
} from 'unocss'

export function createConfig({ dev = true, strict = true } = {}) {
  return defineConfig({
    envMode: dev ? 'dev' : 'build',
    presets: [
      presetUno(),
      presetAttributify({ strict }),
      presetIcons({
        prefix: 'i-',
        extraProperties: {
          display: 'inline-block',
          'vertical-align': 'middle'
        }
      }),
      presetTypography()
    ],
    transformers: [transformerAttributifyJsx()],
    rules: [
      [
        'custom-ellipsis',
        {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap'
        }
      ]
    ]
  })
}

export default createConfig()
