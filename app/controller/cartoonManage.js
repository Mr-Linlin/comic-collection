'use strict';

const Controller = require('egg').Controller;

class CartoonManage extends Controller {
  /**
   *@return 添加类目
   */
  async addCtcategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      name: data.name,
    };
    delete data.id;
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_category', param, '分类');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 修改类别
   */
  async editCtcategory() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCtcategory(data);
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 获取漫画类别
   */
  async getCategory() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_category',1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 根据id删除商品类别 支持批量删除
   */
  async deleteCtcategory() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_category');
    ctx.rBody(res.code, res.msg);
  }

  /**
   *@return 获取漫画列表
   */
  async getCartoonList() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_product', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 添加漫画
   */
  async addCartoon() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      name: data.name,
    };
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_product', param, '漫画');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 修改漫画信息
   */
  async editCartoon() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoon(data);
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id删除 支持批量删除
   */
  async deleteCartoon() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_product');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 根据id获取漫画详情
   */
  async getCartoonDetail() {
    const { ctx } = this;
    const id = ctx.request.query.id;
    const res = await ctx.service.cartoonManage.getCartoonDetail(id, 'lin_product');
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 模糊搜索/精确搜索
   */
  async queryCartoon() {
    const { ctx } = this;
    const { works } = ctx.request.query;
    const select_key = ['id', 'name', 'author', 'img_url', 'cover_lateral', 'category_id', 'read', 'price', 'fabulous'];
    const res = await ctx.service.cartoonManage.searchModel(works, 'name', select_key, 'lin_product');
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 获取漫画阅读的历史记录
   */
  async getRecord() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getMultilistModel(query, ['lin_read', 'lin_product', 'lin_chapter']);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 添加漫画阅读记录
   */
  async readAdd() {
    const { ctx } = this;
    const data = ctx.request.body;
    const { read } = data;
    const param = {
      comic_id: data.comic_id,
      chapter_id: data.chapter_id,
      uid: data.uid,
    };
    delete data.read;
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_read', param, '阅读记录');
    try {
      if (res.code === 200) {
        console.log(res, 'res');
        const param = {
          id: data.comic_id,
          read: Number(read) + 1,
        };
        const res1 = await ctx.service.cartoonManage.editCartoonModel(param, 'lin_product', { id: data.comic_id });
        console.log(param, 'param', res1);
      }
    } catch (error) {
      console.log(error);
    }
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
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_chapter', param, '章节');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 获取章节列表
   */
  async getChapterList() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_chapter', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 获取章节内容
   */
  async getChapterPage() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getChapterPage(query);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
   *@return 添加章节内容
   */
  async addChapterPage() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      chapter_id: data.chapter_id,
      comic_id: data.comic_id,
      image: data.image,
    };
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_chapter_page', param, '章节内容');
    ctx.rBody(res.code, res.msg);
  }
  /**
   *@return 获取角色列表
   */
  async getRoles() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_role', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
 *@return 添加角色
 */
  async addRole() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      role_name: data.role_name,
      role_value: data.role_value,
    };
    data.role_status = data.role_status ? 0 : 1;
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_role', param, '角色');
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 修改角色
  */
  async editRole() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_role', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 删除角色
  */
  async deleteRole() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_role');
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 获取账号列表
  */
  async getAccounts() {
    const { ctx } = this;
    const query = ctx.request.query;
    const res = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_user', 1);
    ctx.rBody(res.code, res.msg, res.data);
  }
  /**
 *@return 添加账号
 */
  async addAccount() {
    const { ctx } = this;
    const data = ctx.request.body;
    const param = {
      // username: data.username,
      phone: data.phone,
    };
    const res = await ctx.service.cartoonManage.addCartoonModel(data, 'lin_user', param, '账号');
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 修改账号
  */
  async editAccount() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.cartoonManage.editCartoonModel(data, 'lin_user', { id: data.id });
    ctx.rBody(res.code, res.msg);
  }
  /**
  *@return 删除账号
  */
  async deleteAccount() {
    const { ctx } = this;
    const res = await ctx.service.cartoonManage.deleteCartoonModel('lin_user');
    ctx.rBody(res.code, res.msg);
  }
}
module.exports = CartoonManage;
