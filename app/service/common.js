/* eslint-disable prefer-const */
/* eslint-disable no-undef */
'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const qiniu = require('qiniu');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const md5 = require('md5');
const qiniuInfo = require('../public/config/qiniu_config.js');
const utils = require('../public/config/utils');
const cheerio = require('cheerio');
const OSS = require('ali-oss');
const sd = require('silly-datetime');
const fse = require('fs-extra');
const mac = new qiniu.auth.digest.Mac(qiniuInfo.accessKey, qiniuInfo.secretKey);
const options = {
  scope: qiniuInfo.bucket, // 七牛资源目录
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
/**
 * @param 处理公共接口的业务逻辑
 */
class CommonService extends Service {
  /**
   * @param {*} data
   *@return 添加菜单路由
   */
  async addMenus(data) {
    const { app } = this;
    if (Object.keys(data).length === 0) return { code: 201, msg: '参数错误' };
    const result = await app.mysql.select('lin_menus', {
      where: { name: data.name, path: data.path },
    });
    if (result.length !== 0) {
      return { code: 201, msg: '路由重复' };
    }
    const res = await app.mysql.insert('lin_menus', data);
    if (res) {
      return { code: 200, msg: '添加路由成功' };
    }
    return { code: 201, msg: '添加路由失败' };
  }
  /**
   *
   * @param {*} query
   *@return 获取菜单路由
   */
  async getMenus(query) {
    const { app } = this;
    let res;
    try {
      if (query === undefined || query === null) {
        res = await app.mysql.select('lin_menus');
      } else {
        const { limit, page } = query;
        res = await app.mysql.select('lin_menus', {
          limit: parseInt(limit) || 5,
          offset: parseInt(page - 1) || 0,
        });
      }
      // const menus = await this.arrayToTree(res);
      return { code: 200, msg: '获取路由成功', menus: res };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }

  /**
   *
   *@returns 上传文件
   */
  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const filename =
      md5(stream.filename) + path.extname(stream.filename).toLocaleLowerCase();
    console.log(filename, 'filename');
    const localFilePath = path.join(__dirname, '../public/upload', filename);
    const writeStream = fs.createWriteStream(localFilePath);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();
      const imgSrc = await new Promise((resolve, reject) => {
        formUploader.putFile(
          uploadToken,
          filename,
          localFilePath,
          putExtra,
          (respErr, respBody, respInfo) => {
            if (respErr) {
              reject(respErr);
            }
            if (respInfo.statusCode === 200) {
              resolve(qiniuInfo.imageUrl + respBody.key);
            } else {
              reject(respErr);
            }
            // 上传之后删除本地文件
            fs.unlinkSync(localFilePath);
          }
        );
      });
      if (imgSrc !== '') {
        return {
          code: 200,
          msg: '上传成功',
          url: imgSrc,
        };
      }
      return { code: 201, msg: '上传失败' };
    } catch (error) {
      // 如果出现错误，关闭管道
      await sendToWormhole(stream);
      console.log(error, 'error');
      return { code: 201, msg: '上传失败' };
    }
  }
  // eslint-disable-next-line jsdoc/require-param
  /**
   * @param {*} data
   *@returns 接收base64格式进行上传文件
   */
  async uploadFile(data) {
    // let { url } = data;
    // console.log(data.base64Str, data.name);
    // const file = await this.base64File(data.base64Str, data.name);
    // let dataBuffer = new Buffer.from(data.base64Str, 'base64');
    // console.log(dataBuffer);
    // let file = fs.writeFileSync(data.name, dataBuffer);
    // console.log(file, 'file');
    // utils.convertImgToBase64(url, function(base) {
    //   console.log(base);
    // });
    return { code: 200, msg: '上传成功' };
  }
  // async uploadAliFile() {
  //   const ctx = this.ctx;
  //   if (!ctx.request.files) {
  //     return { code: 201, msg: '请先选择文件' };
  //   }

  //   const file = ctx.request.files[0];
  //   // console.log(file, '============>>');
  //   // 上传路径文件名
  //   // file.filename文件名，extname后缀名(类似.jpg)
  //   const tt = sd.format(new Date(), 'YYYYMMDDHHmmss');
  //   const ran = parseInt(Math.random() * 89999 + 10000);
  //   const name = 'avatar/' + tt + ran + path.extname(file.filename);
  //   let result;
  //   try {
  //     // 文件上传到os中
  //     result = await ctx.oss.put(name, file.filepath);
  //     // console.log(file.filepath, '===??');
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     await mfs.unlink(file.filepath);
  //   }

  //   if (result) {
  //     return { code: 200, msg: '上传成功', url: result.url };
  //   }

  //   return { code: 201, msg: '上传失败' };
  // }0
  async uploadAliFile() {
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    const tt = sd.format(new Date(), 'YYYYMMDDHHmmss');
    const ran = parseInt(Math.random() * 89999 + 10000);
    const name =
      'avatar/' + tt + ran + path.extname(stream.filename).toLocaleLowerCase();
    const localFilePath = path.join(__dirname, '../public/upload', name);
    const writeStream = fs.createWriteStream(localFilePath);
    await awaitWriteStream(stream.pipe(writeStream));
    console.log(localFilePath, 'localFilePath', stream);
    let result;
    try {
      // 文件上传到os中
      result = await ctx.oss.put(name, localFilePath);
      // console.log(file.filepath, '===??');
    } catch (err) {
      console.log(err);
    } finally {
      // fs.unlinkSync(localFilePath);
    }
    if (result) {
      fs.unlinkSync(localFilePath);
      const obj = { code: 200, msg: '上传成功', url: result.url };
      return obj;
    }

    return { code: 201, msg: '上传失败' };
  }
  async uploadBurstFile() {
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    // console.log(stream);
    const fileNameArr = stream.filename.split('.');
    const UPLOAD_DIR = path.resolve(__dirname, '../public/upload');
    // 3. 确定分片存放的位置
    let chunkDir = `${UPLOAD_DIR}/${fileNameArr[0]}`;
    // console.log(chunkDir, 'chunkDir');
    if (!fse.existsSync(chunkDir)) {
      console.log('文件夹是否存在');
      await fse.mkdirs(chunkDir);
    }
    const localFilePath = path.join(chunkDir, fileNameArr[1]);
    const writeStream = fs.createWriteStream(localFilePath);
    await awaitWriteStream(stream.pipe(writeStream));
    return { code: 200, msg: '上传成功' };
  }
  /**
   * @param {*} name 合并文件名
   */
  async merge(name) {
    const fname = name.split('.');
    // 1.先获取存放的目录
    const UPLOAD_DIR = path.resolve(__dirname, '../public/upload');
    // let chunkDir = `${UPLOAD_DIR}/${fname[0]}`;
    const chunkDir = path.join(UPLOAD_DIR, fname[0]);
    // 读取目录下的所有分片文件
    const chunks = await fse.readdir(chunkDir);
    // console.log(chunks, 'chunks');
    // 然后按照片数得从小到大进行排列，然后再合并
    chunks
      .sort((a, b) => a - b)
      .map((chunkPath) => {
        // 合并文件
        fse.appendFileSync(
          path.join(UPLOAD_DIR, name),
          fse.readFileSync(`${chunkDir}/${chunkPath}`)
        );
      });
    // 删除临时文件夹
    fse.removeSync(chunkDir);
    // 将文件上传到阿里云
    const localFilePath = path.join(UPLOAD_DIR, name);
    console.log(localFilePath, 'localFilePath');
    let result;
    let url;
    try {
      // 文件上传到os中
      // result = await ctx.oss.put(name, localFilePath);
      const client = qiniuInfo.aliInfo;
      result = await this.multipartUpload(name, localFilePath);
      url = `http://${client.bucket}.${client.region}.aliyuncs.com/${name}`;
      console.log(result, '===??');
    } catch (err) {
      console.log(err, '错误');
    } finally {
      // fs.unlinkSync(localFilePath);
    }
    if (result) {
      fs.unlinkSync(localFilePath);
      const obj = { code: 200, msg: '上传成功', url };
      return obj;
    }

    return { code: 201, msg: '上传失败' };
  }
  // 分片上传
  async multipartUpload(fileName, localFilePath) {
    let result;
    try {
      const parallel = 10;
      const partSize = 2 * 1024 * 1024;
      const progress = (p, _checkpoint) => {
        // Object的上传进度。
        console.log(p);
        // 分片上传的断点信息。
        console.log(_checkpoint);
      };
      let ossClient = new OSS(qiniuInfo.aliInfo);
      result = await ossClient.multipartUpload(fileName, localFilePath, {
        parallel,
        partSize,
        progress,
      });
      return result;
    } catch (error) {
      console.log(error);
      return result;
    }
  }
  /**
   *
   * @param {*} dataurl
   * @param {*} filename
   *@return base64转file文件
   */
  async base64toFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const suffix = mime.split('/')[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    // eslint-disable-next-line no-undef
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime,
    });
  }
  /**
   *
   * @param {*} dataurl
   * @param {*} fileName
   *@return base64转换成blob再换成file
   */
  async base64File(dataurl, fileName) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const theBlob = new Blob([u8arr], { type: mime });
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  /**
   *
   * @param {*} comicId 漫画id
   * @param {*} chapterId 章节id，有则获取章节内容，没有则获取章节列表
   * @param {*} method GET/POST
   * @param {*} data
   * @param {*} platform 平台id
   * @param {*} detail 为true则获取详情
   *@return 请求第三方数据
   */
  async queryDetailById(comicId, chapterId, method, data, platform, detail) {
    try {
      let url = '';
      if (detail == '1') {
        url = utils.linkDetail(platform, comicId);
      } else {
        if (chapterId) {
          url = utils.linkSearch(platform, comicId, chapterId);
        } else {
          url = utils.linkSearch(platform, comicId);
        }
      }
      console.log(detail, 'ss', url);
      const query = {
        method: 'GET',
        rejectUnauthorized: false,
        dataType: 'json',
      };
      if (method === 'POST' || method === 'post') {
        query.method = method;
        query.data = data;
      }
      // console.log(platform, 'platform');
      let result = await this.ctx.curl(url, query);
      result = result.data;
      // console.log(result, '==>');
      if (result.code != '200') {
        return { code: 201, msg: '获取数据失败', data: {} };
      }
      return { code: 200, msg: result.message, data: result.data };
    } catch (error) {
      console.log(error);
      return { code: 201, msg: error };
    }
  }
  /**
   * @param {*} pageId 页面id
   * @param {*} comicId 小说id
   * @param {*} type 采集类型 0:详情 1:章节
   */
  async queryNovelDetail(pageId, comicId, type) {
    try {
      console.log(pageId, comicId, type);
      let url = `https://www.9biquge.com/${pageId}/${comicId}/`;
      const res = await this.ctx.curl(url);
      const pageXml = res.data.toString();
      const $ = cheerio.load(pageXml, { decodeEntities: false });
      let data = null;
      // eslint-disable-next-line eqeqeq
      if (type == '1') {
        data = [];
        $('a', 'dd').each(function (i) {
          // data[i] = $(this).attr('href');
          data[i] = {
            title: $(this).text().trim(),
            platform_chapter: $(this).attr('href').split('/')[3].split('.')[0],
            platform_comic: $(this).attr('href').split('/')[2],
          };
        });
        data = utils
          .reduceData(data.reverse(), 'platform_chapter')
          .reverse()
          .map(({ title, platform_chapter, platform_comic }, index) => {
            return {
              title,
              platform_chapter,
              title_alias: index + 1,
              platform_comic,
            };
          });
      } else {
        let name = $('h1', '#info').text().trim();
        let intro = $('#intro', '#info').text().trim();
        let author = $('a', '#info').slice(0).eq(0).text().trim();
        let cover_lateral =
          'https://www.9biquge.com' + $('img', '#fmimg').attr('src').trim();
        const platform_comic = comicId;
        data = {
          name,
          author,
          platform_comic,
          cover_lateral,
          pageId,
          intro: intro.split('\n')[0],
        };
      }

      return { code: 200, msg: '获取成功', data };
    } catch (error) {
      console.log(error, '===<');
      return { code: 201, msg: error };
    }
  }
  /**
   * @param {*} comicId 视频id
   * @param {*} type 采集类型 0:详情；1:剧集
   * @return 获取视频详情
   */
  async queryVideolDetail(comicId, type) {
    try {
      console.log(comicId, type);
      let url = `https://www.shnakun.com/voddetail/${comicId}.html`;
      const res = await this.ctx.curl(url);
      const pageXml = res.data.toString();
      const $ = cheerio.load(pageXml, { decodeEntities: false });
      let data = null;
      // eslint-disable-next-line eqeqeq
      if (type == 0) {
        const name = $('.title', '.stui-content__detail').text().trim();
        const intro = $('.detail-sketch', '.stui-content__detail')
          .text()
          .trim();
        const actor = $('.data', '.stui-content__detail')
          .slice(0)
          .eq(0)
          .text()
          .trim()
          .split('：')[1];
        const director = $('.data', '.stui-content__detail')
          .slice(1)
          .eq(0)
          .text()
          .trim()
          .split('：')[1];
        const cover_lateral = $('img', '.stui-content__thumb ').attr(
          'data-original'
        );
        console.log(cover_lateral, 'author');
        data = {
          name,
          intro,
          actor,
          director,
          platform_comic: comicId,
          cover_lateral,
        };
      } else {
        data = [];
        $('a', '.stui-content__playlist').each(function (i) {
          data[i] = {
            title: $(this).text().trim(),
            platform_chapter: $(this).attr('href').split('/')[2],
          };
        });
        data = utils
          .reduceData(data, 'platform_chapter')
          .map(({ title, platform_chapter }, index) => {
            return {
              title,
              platform_chapter,
              title_alias: index + 1,
            };
          });
      }

      return { code: 200, msg: '获取成功', data };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} platform 平台id
   * @param {*} page 采集页码
   */
  async getCartoonLink(platform, page) {
    try {
      let url = '';
      url = utils.cartoonLink(platform, page);
      const query = {
        method: 'GET',
        rejectUnauthorized: false,
        dataType: 'text',
      };
      let result = await this.ctx.curl(url, query);
      // console.log(result, '==>');
      result = result.data;
      result = result.match(/cover\" href=\"(.+)\" target/g);
      result = result.map((item) => {
        console.log(item.split('/')[1]);
        if (platform == 2) {
          return {
            comic_id: item.split('/')[1],
          };
        } else {
          return {
            url: `https://www.mkzhan.com/${item.split('/')[1]}/`,
          };
        }
      });
      return { code: 200, msg: '获取成功', data: result };
    } catch (error) {
      console.log(error);
      return { code: 201, msg: error };
    }
  }
  /**
   * @param {*} category_id  采集该分类下的的所有链接
   * @param {*} page  采集页码
   */
  async getNovelLink(category_id, page) {
    try {
      let url = `https://www.9biquge.com/${page}/${category_id}`;
      console.log(url, 'url');
      const res = await this.ctx.curl(url);
      const pageXml = res.data.toString();
      const $ = cheerio.load(pageXml, { decodeEntities: false });
      let fruits = [];
      $('a', '.s2').each(function (i) {
        fruits[i] = $(this).attr('href');
      });
      // console.log(fruits, 'fruits');
      fruits = fruits.map((item) => {
        return {
          url: `https://www.9biquge.com${item}`,
        };
      });
      // console.log(result, 'result');
      return { code: 200, msg: '获取成功', data: fruits };
    } catch (error) {
      console.log(error);
      return { code: 201, msg: error };
    }
  }
  /**
   *
   * @param {*} key 查询条件
   */
  async searchKey({ key, page, page_size }) {
    try {
      const param = {
        method: 'GET',
        rejectUnauthorized: false,
        dataType: 'json',
      };
      let url = `https://comic.mkzcdn.com/search/keyword/?keyword=${key}&page_num=${page}&page_size=${page_size}`;
      const res = await this.ctx.curl(url, param);
      if (res.status == 200) {
        if (res.data.code == '101') {
          return { code: 201, msg: res.data.message };
        }
        const data = {
          list: res.data.data?.list,
          total: Number(res.data.data?.count),
        };
        return { code: 200, msg: '获取成功', data };
      } else {
        return { code: 201, msg: '采集失败' };
      }
    } catch (error) {
      console.log(error);
      return { code: 201, msg: error };
    }
  }
  /**
   * @param {*} page 采集页码
   * @return 采集视频链接
   */
  async getVideoLink(page) {
    try {
      let url = `https://www.shnakun.com/vodshow/13--------${page}---.html`;
      const res = await this.ctx.curl(url);
      const pageXml = res.data.toString();
      const $ = cheerio.load(pageXml, { decodeEntities: false });
      let data = [];
      $('a', '.stui-vodlist__box').each(function (i) {
        data[i] = $(this).attr('href');
      });
      data = data.map((item) => {
        return {
          url: `https://www.shnakun.com${item}/`,
        };
      });
      return { code: 200, msg: '获取成功', data };
    } catch (error) {
      return { code: 201, msg: error };
    }
  }
  async getHomeData() {
    const { ctx } = this;
    let max = 20;
    let random = Math.floor(Math.random() * (max - 1)) + 1;
    const query = {
      page: random,
      pageSize: 6,
    };
    const titles = ['精品推荐', '独家作品', '上升最快', '新作尝鲜', '合作作品'];
    try {
      let banners = await ctx.service.cartoonManage.getCartoonModel(
        query,
        'lin_product'
      );
      // let  = await ctx.service.cartoonManage.getCartoonModel(query, 'lin_product');
      banners = banners.data.data.map((item) => {
        return {
          id: item.id,
          img: item.cover_lateral,
        };
      });
      let details = [];
      for (let i = 0; i < titles.length; i++) {
        const item = titles[i];
        random = Math.floor(Math.random() * (max - 1)) + 1;
        const param = {
          page: random,
          pageSize: 6,
        };
        console.log(param, 'param');
        let res = await ctx.service.cartoonManage.getCartoonModel(
          param,
          'lin_product'
        );
        res = res.data.data;
        let obj = {
          title: item,
          data: res,
        };
        details.push(obj);
      }
      // console.log(banners);
      return { code: 200, msg: '获取成功', data: { banners, details } };
    } catch (error) {
      return { code: 201, msg: '获取失败', data: {} };
    }
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
}
module.exports = CommonService;
