'use strict';

const Service = require('egg').Service;
const info = require('../public/config/qiniu_config.js');

class CartoonManageService extends Service {
  /**
   *
   * @param {*} data
   *@return 添加漫画类别
   */
  async addCtcategory(data) {
    const { app } = this;
    try {
      delete data.id;
      const res = await app.mysql.select('lin_category', { where: data });
      if (res.length !== 0) {
        return { code: 201, msg: '类目重复' };
      }
      data.create_time = new Date();
      await app.mysql.insert('lin_category', data);
      return { code: 200, msg: '添加成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} query
   *@return 获取产品类别
   */
  async getCategory(query) {
    const { app } = this;
    const { page, pageSize, category_name } = query;
    console.log(page, pageSize);
    const param = {
      limit: Number(pageSize), // 返回数据量
      offset: (page - 1) * pageSize,
    };
    if (category_name) {
      param.where = {
        name: category_name,
      };
    }
    try {
      const res = await app.mysql.select('lin_category', param);
      const obj = {
        data: res,
        total: res.length,
      };
      return { code: 200, msg: '获取产品类别成功', data: obj };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} data
   *@return 根据id修改类别信息
   */
  async editCtcategory(data) {
    const { app } = this;
    try {
      const res = await app.mysql.select('lin_category', {
        where: { id: data.id },
      });
      if (res.length === 0) {
        return { code: 201, msg: '类别不存在' };
      }
      const res1 = await app.mysql.select('lin_category', {
        where: { name: data.name },
      });
      if (res1.length > 0) {
        return { code: 201, msg: '分类名重复' };
      }
      await app.mysql.update('lin_category', data);
      return { code: 200, msg: '修改成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} ids
   *@return 根据id删除类别
   */
  async deleteCtcategory(ids) {
    const { app } = this;
    try {
      const idArr = ids.split(',');
      for (const key in idArr) {
        await app.mysql.delete('lin_category', { id: idArr[key] });
      }
      return { code: 200, msg: '删除成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} query
   *@return 获取漫画列表
   */
  async getCartoonList(query) {
    const { app } = this;
    const { page, pageSize, category_name } = query;
    console.log(page, pageSize);
    const param = {
      limit: Number(pageSize), // 返回数据量
      offset: (page - 1) * pageSize,
    };
    if (category_name) {
      param.where = {
        name: category_name,
      };
    }
    try {
      const res = await app.mysql.select('lin_product', param);
      const obj = {
        data: res,
        total: res.length,
      };
      return { code: 200, msg: '获取漫画列表成功', data: obj };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} data
   *@return 添加漫画
   */
  async addCartoon(data) {
    const { app } = this;
    try {
      const res = await app.mysql.select('lin_product', {
        where: { name: data.name },
      });
      if (res.length !== 0) {
        return { code: 201, msg: '漫画已存在' };
      }
      data.create_time = new Date();
      await app.mysql.insert('lin_product', data);
      return { code: 200, msg: '添加成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} data
   *@return 根据id修改漫画信息
   */
  async editCartoon(data) {
    const { app } = this;
    try {
      const res = await app.mysql.select('lin_product', {
        where: { id: data.id },
      });
      if (res.length === 0) {
        return { code: 201, msg: '漫画信息不存在' };
      }
      delete data.create_time;
      delete data.update_time;
      await app.mysql.update('lin_product', data);
      return { code: 200, msg: '修改成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} data 修改的数据
   * @param {*} table
   * @param {*} query 查询条件
   * @return
   */
  async editCartoonModel(data, table, query) {
    const { app } = this;
    try {
      const res = await app.mysql.select(table, { where: query });
      if (res.length === 0) {
        return { code: 201, msg: '数据不存在' };
      }
      delete data.create_time;
      delete data.update_time;
      await app.mysql.update(table, data);
      return { code: 200, msg: '修改成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} table 数据表
   *@return 根据id删除漫画
   */
  async deleteCartoonModel(table) {
    const { app, ctx } = this;
    const ids = ctx.request.body.ids;
    try {
      const idArr = ids.split(',');
      for (const key in idArr) {
        console.log(idArr, 'idArr', idArr[key]);
        await app.mysql.delete(table, { id: idArr[key] });
      }
      return { code: 200, msg: '删除成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} id 根据id获取漫画详情
   * @param {*} table 表名
   * @return
   */
  async getCartoonDetail(id, table) {
    const { app } = this;
    const param = {
      where: {
        id,
      },
    };
    try {
      const res = await app.mysql.select(table, param);
      console.log(res, 'res');
      return { code: 200, msg: '获取详情成功', data: res[0] };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   * @param {*} data 查询条件
   * @param {*} table  数据库表
   *@returns
   */
  async getCartoonDetailModel(data, table) {
    const { app } = this;
    const param = {
      where: data,
    };
    try {
      const res = await app.mysql.select(table, param);
      // console.log(res, 'res');
      return res[0];
    } catch (error) {
      // console.log(1111111111111);
      return { code: 201, msg: error };
    }
  }
  /**
   * @param {*} key 模糊搜索值
   * @param {*} criteria 查询条件
   * @param {*} search_keys 查询的字段
   * @param {*} table 数据库表
   */
  async searchModel(key, criteria, search_keys, table) {
    const { app } = this;
    try {
      // const query_str = search_keys.join(',');
      // const redisStr = table + query_str + key;
      const sql = `select * from ${table} where ${criteria} like "%${key}%"`;
      // console.log(sql, 'sql');
      // const redisInfo = await this.service.redis.get(redisStr);
      // if (redisInfo) {
      //   console.log(redisInfo.length, 'redisInfo', redisStr);
      //   return { code: 200, msg: '搜索成功', data: redisInfo };
      // }
      const res = await app.mysql.query(sql);
      // const data = res.splice(0, 9);
      // this.service.redis.set(redisStr, res);
      return { code: 200, msg: '搜索成功', data: res };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  // 登录漫客栈，获取sign
  async mkzLogin() {
    const { ctx } = this;
    const data = {
      account: info.ACCOUNT,
      password: info.PASSWORD,
    };
    const url = 'https://member.mkzcdn.com/login/account/';
    const query = {
      method: 'POST',
      rejectUnauthorized: false,
      dataType: 'json',
      data,
    };
    let result = await ctx.curl(url, query);
    result = result.data;
    if (result.code == '200') {
      return result.data;
    }
    return {};
  }
  // eslint-disable-next-line jsdoc/check-param-names
  /**
   * @param {*} data 数据
   */
  async getChapterPage(query) {
    console.log(query, '===>');
    const { ctx } = this;
    const { sign, uid } = await this.getCartoonDetailModel(
      { id: 1 },
      'lin_sign'
    );
    const { platform_chapter, comic_id } = await this.getCartoonDetailModel(
      query,
      'lin_chapter'
    );
    const { platform_comic } = await this.getCartoonDetailModel(
      { id: comic_id },
      'lin_product'
    );
    console.log('res', uid, '==', sign);
    console.log(comic_id, 'comic_id');
    // sign = '3e881c73a538b4add0ad4494520ac826';
    // uid = '59120260';
    let url = `https://comic.mkzcdn.com/chapter/content/v1/?chapter_id=${platform_chapter}&comic_id=${platform_comic}&format=1&quality=1&sign=${sign}&type=1&uid=${uid}`;
    const param = {
      method: 'GET',
      rejectUnauthorized: false,
      dataType: 'json',
    };
    // console.log(platform, 'platform');
    let result = await ctx.curl(url, param);
    result = result.data;
    // console.log(result, 'result');
    if (result.code == '200') {
      return { code: 200, msg: '获取章节内容成功', data: result.data.page };
    } else if (result.code == '302' || result.code == '301') {
      const { sign, uid } = await this.mkzLogin();
      console.log('获取最新sign', sign);
      await this.editCartoonModel({ id: 1, sign, uid }, 'lin_sign', { id: 1 });
      url = `https://comic.mkzcdn.com/chapter/content/v1/?chapter_id=${platform_chapter}&comic_id=${platform_comic}&format=1&quality=1&sign=${sign}&type=1&uid=${uid}`;
      let result = await ctx.curl(url, param);
      result = result.data;
      if (result.code == '200') {
        return { code: 200, msg: '获取章节内容成功', data: result.data.page };
      }
      return { code: 201, msg: result.message, data: [] };
    }
    return { code: 201, msg: result.message, data: [] };
  }
  /**
   *
   * @param {*} data 数据
   * @param {*} table 表名
   * @param {*} param 查询条件 {name:''}
   * @param {*} msg 提示信息
   *@return
   */
  async addCartoonModel(data, table, param, msg) {
    console.log(param, 'param', table);
    const { app } = this;
    try {
      const res = await app.mysql.select(table, { where: param });
      if (res.length !== 0) {
        return { code: 201, msg: `${msg}已存在` };
      }
      data.create_time = new Date();
      await app.mysql.insert(table, data);
      return { code: 200, msg: '添加成功' };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} query 分页查询
   * @param {*} table 表名
   * @param {*} redisType 是否开启redis
   *@return
   */
  async getCartoonModel(query, table, redisType = 0) {
    const { app } = this;
    let page = 1;
    let pageSize = 10;
    let obj = {};
    let redisStr = table;

    if (Object.keys(query).length > 0) {
      if (query.page && query.pageSize) {
        page = query.page;
        pageSize = query.pageSize;
        delete query.pageSize;
        delete query.page;
      }
      obj = query;
    }
    const params = {
      limit: Number(pageSize), // 返回数据量
      offset: (page - 1) * pageSize,
    };
    redisStr += params.limit;
    redisStr += params.offset;

    if ('isAll' in obj && query.isAll) {
      redisStr += query.isAll;
      delete params.limit;
      delete params.offset;
      delete obj.isAll;
    }
    if (Object.keys(obj).length > 0) {
      Object.keys(obj).forEach((item) => {
        if (obj[item] == '') {
          delete obj[item];
        }
        redisStr += obj[item];
      });
      params.where = obj;
    }
    console.log(params, 'params', query);
    try {
      // if (redisType !== 1) {
      //   const redisInfo = await this.service.redis.get(redisStr);
      //   if (redisInfo) {
      //     console.log(redisInfo, 'redisInfo', redisStr);
      //     return { code: 200, msg: '获取列表成功', data: redisInfo };
      //   }
      // }
      const res = await app.mysql.select(table, params);
      const res1 = await app.mysql.select(table);
      // console.log(res, '===>');
      const obj = {
        data: res,
        total: res1.length,
      };
      // console.log(res1[0], '===>');

      // this.service.redis.set(redisStr, obj);
      return { code: 200, msg: '获取列表成功', data: obj };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   * @param {*} query 查询的条件
   * @param {*} tables 查询的多个表
   * @return 多表查询模板
   */
  async getMultilistModel(query, tables) {
    try {
      query.isAll = true;
      const { code, data } = await this.getCartoonModel(query, tables[0], 1);
      if (code === 200) {
        let list = data.data.map(({ comic_id, chapter_id, create_time }) => {
          return {
            comic_id,
            chapter_id,
            create_time,
          };
        });
        list.forEach((item) => {
          item.create_time = item.create_time.getTime();
        });
        // console.log(list, '====>');
        list.sort((a, b) => {
          return b.create_time - a.create_time;
        });
        // console.log(list);
        const map = new Map();
        list = list.filter((item) => {
          return !map.has(item.comic_id) && map.set(item.comic_id, 1);
        });
        // console.log(list, '===>');
        const readList = [];
        for (let index = 0; index < list.length; index++) {
          const item = list[index];
          // console.log(item);
          const sql = `select e.id, e.name ,e.img_url, d.title ,d.chapter_id from lin_product e inner join lin_chapter d on e.id =d.comic_id where e.id = ${item.comic_id} and d.chapter_id = ${item.chapter_id};`;
          const res = await this.app.mysql.query(sql);
          if (res.length !== 0) {
            readList.push(res[0]);
          }
        }
        // console.log(readList, '===>');
        return { code: 200, msg: '获取列表成功', data: readList };
      }
      return { code: 201, msg: '获取记录失败', data: {} };
    } catch (error) {
      console.log(error);
      return { code: 201, msg: error };
    }
  }
}
module.exports = CartoonManageService;
