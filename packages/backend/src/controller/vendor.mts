import Koa from 'koa'
import { api2DProfile } from '../service/vendor.mjs'

export default class VendorController {
  /**
   * 获取vendor用户信息
   * @param ctx
   */
  public static async postApi2DProfile(ctx: Koa.Context) {
    await api2DProfile(ctx)
  }
}
