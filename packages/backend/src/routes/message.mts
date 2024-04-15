import MessageController from '../controller/message.mjs'
import { router } from './index.mjs'

router.all('/sendMsg/sse', MessageController.sendMsgSSE)

router.del('/del/:id', MessageController.delStore)

export { router }
