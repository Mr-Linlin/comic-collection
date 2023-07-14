'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const { AppID, AppSecret } = require('../public/config/qiniu_config.js');

class UserService extends Service {
  async getUser() {
    const { app } = this;
    const data = await app.mysql.select('lin_user');
    return data;
  }
  //
  /**
   *
   * @param {*} data
   *@returns 登录
   */
  async login(data) {
    try {
      const { ctx, app } = this;
      const myreg = /^1\d{10}$/;
      const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      let res;
      if (myreg.test(data.account) || emailReg.test(data.account)) {
        if (myreg.test(data.account)) {
          res = await app.mysql.select('lin_user', {
            where: { phone: data.account },
          });
        } else if (emailReg.test(data.account)) {
          res = await app.mysql.select('lin_user', {
            where: { email: data.account },
          });
        }
        if (res.length === 0) {
          return { code: 201, msg: '账号未注册！' };
        }
        // console.log(res[0].username, 'res');
        if (data.password !== res[0].password) {
          return { code: 201, msg: '密码错误' };
        }
        const userInfo = { ...res[0] };
        delete userInfo.password;
        console.log(userInfo, 'user');
        const token = await this.setToken(data);
        const menus = await this.getMenus(userInfo.role_id);
        // console.log(menus, 'menus');
        return { code: 200, msg: '登录成功', token, menus, userInfo };
      }
      return { code: 201, msg: '账号格式错误' };
    } catch (error) {
      console.log(error);
      return { code: 201, msg: '参数错误' };
    }
  }
  /**
   * @param {*} user 用户信息
   */
  async wxLogin(user) {
    try {
      // 根据code获取openId
      const url = 'https://api.weixin.qq.com/sns/jscode2session';
      const params = {
        appid: AppID,
        secret: AppSecret,
        js_code: user.code,
        grant_type: 'authorization_code',
      };
      const str = obj2String(params);
      const result = await this.ctx.axios.get(`${url}?${str}`);
      const { session_key, openid } = result;
      console.log(result, 'openid');
      if (!openid) {
        return { code: 201, msg: 'code重复使用' };
      }
      let res = await this.app.mysql.select('lin_user', {
        where: { openid },
      });
      console.log(user, 'user');
      if (res.length === 0) {
        const obj = {
          username: user.username,
          password: '123456',
          avatar: user.avatar,
          session_key,
          openid,
        };
        await this.app.mysql.insert('lin_user', obj);
        res = await this.app.mysql.select('lin_user', {
          where: { openid },
        });
      }
      const userInfo = { ...res[0] };
      delete userInfo.password;

      console.log(res, 'result==========');
      const token = await this.setToken(user);
      return { code: 200, msg: '登录成功', token, userInfo };
    } catch (error) {
      console.log(error);
      return { code: 201, msg: '参数错误' };
    }
  }
  /**
   *
   * @param {*} data
   *@return 注册
   */
  async register(data) {
    const { app } = this;
    const user = {};
    const res = await app.mysql.select('lin_user', {
      where: { username: data.username },
    });
    if (res.length !== 0) {
      return { code: 201, msg: '用户已存在' };
    }
    const myreg = /^1\d{10}$/;
    const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (myreg.test(data.account) || emailReg.test(data.account)) {
      if (myreg.test(data.account)) {
        user.phone = data.account;
      } else if (emailReg.test(data.account)) {
        user.email = data.account;
      }
      const res = await app.mysql.select('lin_user', { where: user });
      if (res.length !== 0) {
        return { code: 201, msg: '用户已存在' };
      }
      user.username = data.username;
      user.password = data.password;
      user.role_id = 0;
      await app.mysql.insert('lin_user', user);
      return { code: 200, msg: '注册成功' };
    }
    return { code: 201, msg: '账号格式错误' };
  }
  /**
   *
   * @param {*} id 角色id
   *@returns 角色拥有的菜单
   */
  async getMenus(id) {
    const res = await this.ctx.service.cartoonManage.getCartoonModel(
      { id },
      'lin_role'
    );
    // console.log(id, '==>', res);
    let newMenus = [];
    if (id > 0) {
      if (res.data.data.length > 0) {
        let { menus } = res.data.data[0];
        // console.log(res.data.data, '===');
        menus = menus.split(',');
        const res1 = await this.ctx.service.common.getMenus();
        newMenus = this.format(res1.menus, menus);
      }
    }
    return newMenus;
  }
  format(arr, menus) {
    let menuIds = [];
    menus.forEach((item) => {
      console.log(item);
      const menu = arr.find((v) => v.id == item);
      if (menu) {
        menuIds.push(menu.parent_id);
      }
    });
    menuIds = menuIds.concat(menus);
    menuIds = new Set(menuIds.map(JSON.stringify)); // 将对象转成字符串，并用Set去重
    menuIds = Array.from(menuIds).map(JSON.parse); // 将字符串转回对象
    arr = arr.map((v) => {
      return {
        ...v,
      };
    });
    menuIds = menuIds
      .filter((item) => item != 0)
      .map((v, i) => {
        const index = arr.findIndex((k) => k.id == v);
        if (index > -1) {
          return {
            ...arr[index],
          };
        }
        return null;
      })
      .filter((e) => e !== null);

    menuIds.forEach((item) => {
      if (item.parent_id != 0) {
        const menu = arr.find((v) => v.id == item.parent_id);
        if (menu) {
          menuIds.push(menu);
        }
      }
    });

    menuIds = new Set(menuIds.map(JSON.stringify)); // 将对象转成字符串，并用Set去重
    menuIds = Array.from(menuIds).map(JSON.parse); // 将字符串转回对象
    console.log(menuIds, 'menuIds');

    menuIds = this.arrayToTree(menuIds);
    return menuIds;
  }
  /**
   * @param {*} items
   *@return 将路由数据转为扁平化对象
   */
  async arrayToTree(items) {
    const res = []; // 存放结果集
    const map = {};
    // 判断对象是否有某个属性
    const getHasOwnProperty = (obj, property) =>
      Object.prototype.hasOwnProperty.call(obj, property);

    // 边做map存储，边找对应关系
    for (const i of items) {
      map[i.id] = {
        ...i,
        children: getHasOwnProperty(map, i.id) ? map[i.id].children : [],
      };
      const newItem = map[i.id];
      if (i.parent_id === 0) {
        res.push(newItem);
      } else {
        if (!getHasOwnProperty(map, i.parent_id)) {
          map[i.pid] = {
            children: [],
          };
        }
        map[i.parent_id].children.push(newItem);
      }
    }
    return res;
  }
  /**
   *
   * @param {*} data
   *@return 生成token
   */
  async setToken(data) {
    const { app } = this;
    const token = app.jwt.sign(data, app.config.jwt.key, { expiresIn: '24h' });
    if (!token) return;
    // if (ctx.session.tokenList) {
    //   ctx.session.tokenList.push(token);
    // } else {
    //   ctx.session.tokenList = [ token ];
    // }
    return token;
  }
  /**
   * @param {*} token
   *@return 验证token信息
   */
  async verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret);
  }
}
/**
 * 真正的请求
 * @param url 请求地址
 * @param options 请求参数
 * @param method 请求方式
 */
function commonFetcdh(url, options, method = 'GET') {
  const searchStr = obj2String(options);
  let initObj = {};
  if (method === 'GET') {
    // 如果是GET请求，拼接url
    url += '?' + searchStr;
    initObj = {
      method,
      credentials: 'include',
    };
  }
  // eslint-disable-next-line no-undef
  fetch(url, initObj)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    });
}
/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = [], idx = 0) {
  for (const item in obj) {
    arr[idx++] = [item, obj[item]];
  }
  return new URLSearchParams(arr).toString();
}

function randomCoding(num) {
  // 创建26个字母数组
  const arr = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  const idvalue = '';
  for (let i = 0; i < num; i++) {
    idvalue += arr[Math.floor(Math.random() * 26)];
  }
  return idvalue;
}
module.exports = UserService;
