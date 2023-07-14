'use strict';
const cheerio = require('cheerio');
const Service = require('egg').Service;
const userAgents = require('../public/userAgent');
class NovleManageService extends Service {
  /**
   * @param {*} data 数据
   */
  async getNovelPage(data) {
    try {
      console.log(data);
      const { platform_chapter, comic_id } = await this.ctx.service.cartoonManage.getCartoonDetailModel(data, 'lin_novel_chapter');
      const { platform_comic, pageId } = await this.ctx.service.cartoonManage.getCartoonDetailModel({ id: comic_id }, 'lin_novel');
      const url = `https://www.9biquge.com/${pageId}/${platform_comic}/${platform_chapter}.html`;
      const userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
      const param = {
        headers: {
          'User-Agent': userAgent,
        },
      };
      const res = await this.ctx.curl(url, param);
      const pageXml = res.data.toString();
      const $ = cheerio.load(pageXml, { decodeEntities: false });
      const fruits = [];
      $('.content_detail', '#content').each(function (i) {
        fruits[i] = $(this).text();
      });
      const textInfo = fruits.join(' ');
      // console.log(textInfo, 'fruits');
      return { code: 200, msg: '获取章节内容成功', data: textInfo };
    } catch (error) {
      console.log(error);
      return { code: 201, msg: '获取章节内容失败', data: error };
    }
  }
  /**
   * @param {*} data 
   *@return 获取视频链接
   */
  async getVideoPage(data) {
    try {
      const { platform_chapter } = await this.ctx.service.cartoonManage.getCartoonDetailModel(data, 'lin_video_chapter');
      const url = `https://www.shnakun.com/vodplay/${platform_chapter}`;
      const userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
      const param = {
        headers: {
          dataType: 'text',
          'User-Agent': userAgent,
        },
      };
      const res = await this.ctx.curl(url, param);
      const pageXml = res.data.toString();
      const $ = cheerio.load(pageXml, { decodeEntities: false });
      let str = $('script', '.stui-player__video').text().trim();
      str = JSON.parse(str.match(/aaa\=(.+)/)[1]);
      // console.log(str);
      const obj = {
        url: str.url,
        url_next: str.url_next,
      };
      return { code: 200, msg: '获取视频链接成功', data: obj };

    } catch (error) {
      return { code: 201, msg: '获取视频链接失败', data: [] };

    }
  }
}

module.exports = NovleManageService;
