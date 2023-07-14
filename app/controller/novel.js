'use strict';
const Controller = require('egg').Controller;

class NovelManage extends Controller {
  // 获取小说内容
  async getNovelPage() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.novel.getNovelPage(query);
    ctx.rBody(res.code, res.msg, res.data);
  }
  // 获取视频播放链接
  async getVideoPage() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.novel.getVideoPage(query);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
 *@return 添加分类
 */
  async addCtcategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      name: data.name,
      parent_id: data.parent_id,
    };
    delete data.id;
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_novel_categoty', param, '分类');
    ctx.rBody(res.code, res.msg);
  }
  /**
 *@return 获取分类列表
 */
  async getCategory() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_novel_categoty', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
*@return 修改分类
*/
  async editCtcategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_novel_categoty', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
*@return 删除小说类别
*/
  async deleteCtcategory() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_novel_categoty');
    ctx.rBody(res.code, res.msg);
  }
  /**
 *@return 获取小说列表
 */
  async getCartoonList() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_novel', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 添加小说
   */
  async addCartoon() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      name: data.name,
    };
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_novel', param, '漫画');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 修改小说信息
   */
  async editCartoon() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_novel', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id删除 支持批量删除
   */
  async deleteCartoon() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_novel');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id获取小说详情
   */
  async getCartoonDetail() {
    const { ctx } = this;
    const id = ctx.request.query.id;
    const res = await ctx.service.cartoonManage.getCartoonDetail(id, 'lin_novel');
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
*@return 添加章节
*/
  async addChapter() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      title: data.title,
      comic_id: data.comic_id,
    };
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_novel_chapter', param, '章节');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 获取章节列表
   */
  async getChapterList() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_novel_chapter', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
  *@return 修改章节信息
  */
  async editChapter() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_novel_chapter', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id删除 支持批量删除
   */
  async deleteChapter() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_novel_chapter');
    ctx.rBody(res.code, res.msg);
  }
  /**
*@return 添加分类
*/
  async addVideoCtcategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      name: data.name,
      parent_id: data.parent_id,
    };
    delete data.id;
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_video_categoty', param, '分类');
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 获取分类列表
  */
  async getVideoCategory() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_video_categoty', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
  *@return 修改分类
  */
  async editVideoCtcategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_video_categoty', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 删除视频类别
  */
  async deleteVideoCtcategory() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_video_categoty');
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 获取视频列表
  */
  async getVideoList() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_video', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 添加视频
   */
  async addVideo() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      name: data.name,
    };
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_video', param, '视频');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 修改视频信息
   */
  async editVideo() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_video', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id删除 支持批量删除
   */
  async deleteVideo() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_video');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id获取视频详情
   */
  async getVideoDetail() {
    const { ctx } = this;
    const id = ctx.request.query.id;
    const res = await ctx.service.cartoonManage.getCartoonDetail(id, 'lin_video');
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
*@return 添加剧集
*/
  async addVideoChapter() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      title: data.title,
      comic_id: data.comic_id,
    };
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_video_chapter', param, '章节');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 获取剧集列表
   */
  async getVideoChapterList() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_video_chapter', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
  *@return 修改剧集信息
  */
  async editVideoChapter() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_video_chapter', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id删除 支持批量删除
   */
  async deleteVideoChapter() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_video_chapter');
    ctx.rBody(res.code, res.msg);
  }
}
module.exports = NovelManage;
