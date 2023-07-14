'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
   *@return 登录接口
   */
  async login() {
    const { ctx } = this;
    const user = ctx.request.body;
    const data = await ctx.service.user.login(user);
    ctx.rBody(data.code, data.msg, { token: data.token, menus: data.menus, userInfo: data.userInfo });
  }
  /**
  *@return 微信一键登录接口
  */
  async wxLogin() {
    const { ctx } = this;
    const user = ctx.request.body;
    const data = await ctx.service.user.wxLogin(user);
    ctx.rBody(data.code, data.msg, { token: data.token, userInfo: data.userInfo });
  }
  /**
   *@return 注册接口
   */
  async register() {
    const { ctx } = this;
    const userInfo = ctx.request.body;
    const res = await ctx.service.user.register(userInfo);
    ctx.rBody(res.code, res.msg);
  }
}
module.exports = UserController;
