import debugLibrary from 'debug'
import Koa from 'koa'
import cors from 'koa2-cors'
import history from 'koa2-history-api-fallback'
import bodyparser from 'koa-bodyparser'
import etag from 'koa-etag'
import json from 'koa-json'
import logger from 'koa-logger'
import onerror from 'koa-onerror'
import serve from 'koa-static'
import path from 'path'

import { router as message } from './routes/message.mjs'
import { router as vendor } from './routes/vendor.mjs'
import users from './routes/users.mjs'
import conditional from './utils/koa-conditional-get.mjs'

const debug = debugLibrary('app')

let app = new Koa()

app.use(
  cors({
    origin: '*',
    allowHeaders: ['*']
  })
)
// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)

app.use(json())
app.use(logger())

app.use(async (ctx, next) => {
  await next()
})

app.use(history())

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// etag 304
app.use(conditional())
app.use(etag())

// logger
app.use(async (ctx, next) => {
  const start = new Date().getTime()
  await next()
  const ms = new Date().getTime() - start
  debug(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(
  serve(path.resolve('..', 'frontend/dist'), {
    // 设置cache-controll缓存时间
    maxage: 1000 * 60 * 60 * 2,
    // index.html禁止缓存
    setHeaders(res, filePath) {
      const { base } = path.parse(filePath)
      if (base === 'index.html') {
        res.setHeader('Cache-Control', 'max-age=0')
      }
    }
  })
)

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
app.use(users.routes()).use(users.allowedMethods())
app.use(message.routes()).use(message.allowedMethods())
app.use(vendor.routes()).use(vendor.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  debug('server error', err, ctx)
})

export default app
