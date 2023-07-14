'use strict';

const Controller = require('egg').Controller;

/**
 * @param 处理公共接口
 */
class CommonController extends Controller {
  /**
   *@return 获取菜单路由信息
   */
  async getMenus() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_menus',1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 添加路由
   */
  async addMenus() {
    const { ctx } = this;
    const menu = ctx.request.body;
    const res = await ctx.service.common.addMenus(menu);
    ctx.rBody(res.code, res.msg);
  }
    /**
   *@return 修改路由
   */
   async editMenu() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_menus', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
    /**
   *@return 根据id删除商品类别 支持批量删除
   */
   async delMenu() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_menus');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 文件上传
   */
  async upload() {
    const { ctx } = this;
    const res = await ctx.service.common.upload();
    ctx.rBody(res.code, res.msg, { url: res.url });
  }
  // eslint-disable-next-line jsdoc/check-param-names
  /**
   * @param {*} base64Str
   *@returns 接收base64格式进行上传文件
   */
  async uploadFile() {
    const { ctx } = this;
    const data = ctx.request.body;
    // console.log(data);
    const res = await ctx.service.common.uploadFile(data);
    ctx.rBody(res.code, res.msg, { url: res.url });
  }
  /**
   *@returns 阿里云上传文件
   */
  async uploadAliFile() {
    const { ctx } = this;
    const res = await ctx.service.common.uploadAliFile();
    ctx.rBody(res.code, res.msg, { url: res.url });
  }
  /**
   *@returns 分片上传
   */
  async uploadBurstFile() {
    const { ctx } = this;
    const res = await ctx.service.common.uploadBurstFile();
    ctx.rBody(res.code, res.msg, { spliceMd5: res.spliceMd5 });
  }
  /**
   *@returns 合并分片信息上传到阿里云
   */
  async merge() {
    const { ctx } = this;
    const { fileName } = ctx.request.body;
    const res = await ctx.service.common.merge(fileName);
    ctx.rBody(res.code, res.msg, { url: res.url });
  }
  /**
   *@return 获取第三方漫画接口
   */
  async queryDetailById() {
    const { ctx } = this;
    const { comicId, method, data, platform, chapterId, detail } = ctx.request.body;
    const res = await ctx.service.common.queryDetailById(comicId, chapterId, method, data, platform, detail);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 获取第三方小说接口
   */
  async queryNovelDetail() {
    const { ctx } = this;
    const { comicId, pageId, type } = ctx.request.body;
    const res = await ctx.service.common.queryNovelDetail(pageId, comicId, type);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 获取第三方视频接口
   */
  async queryVideolDetail() {
    const { ctx } = this;
    const { comicId, type } = ctx.request.body;
    const res = await ctx.service.common.queryVideolDetail(comicId, type);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 获取漫画连接
   */
  async getCartoonLink() {
    const { ctx } = this;
    const { platform, page } = ctx.request.body;
    const res = await ctx.service.common.getCartoonLink(platform, page);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 获取小说连接
   */
  async getNovelLink() {
    const { ctx } = this;
    const { category_id, page } = ctx.request.body;
    const res = await ctx.service.common.getNovelLink(page, category_id);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 漫画关键字采集
   */
  async searchKey() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.common.searchKey(query);
    ctx.rBody(res.code, res.msg, res.data);

  }
  /**
 *@return 获取视频连接
 */
  async getVideoLink() {
    const { ctx } = this;
    const { page } = ctx.request.body;
    const res = await ctx.service.common.getVideoLink(page);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
     *@return 获取首页内容
     */
  async getHomeData() {
    const { ctx } = this;
    const res = await ctx.service.common.getHomeData();
    ctx.rBody(res.code, res.msg, res.data);
  }
}
module.exports = CommonController;
