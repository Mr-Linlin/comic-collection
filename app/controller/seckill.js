"use strict";

const Controller = require("egg").Controller;
class SeckillManage extends Controller {
  async getTrainList() {
    const { ctx } = this;
    const data = ctx.request.query;
    const res = await ctx.service.seckill.getTrainList(data);
    // console.log(res);
    ctx.rBody(res.code, res.msg, res.data);
  }
  async upCookie() {
    const { ctx } = this;
    const { cookies, type } = ctx.request.body;
    const res = await ctx.service.seckill.upCookie(cookies, type);
    ctx.rBody(res.code, res.msg);
  }
  async serach() {
    const { ctx } = this;
    const { keyWords } = ctx.request.query;
    const res = await ctx.service.seckill.serach(keyWords);
    ctx.rBody(res.code, res.msg, res.data);
  }
}
module.exports = SeckillManage;
