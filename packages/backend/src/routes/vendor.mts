import { router } from './index.mjs'
import VendorController from '../controller/vendor.mjs'

router.post('/userProfile/api2d', VendorController.postApi2DProfile)

export { router }
