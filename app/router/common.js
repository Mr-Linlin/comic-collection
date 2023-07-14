'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/addMenus', controller.common.addMenus);
  router.post('/api/system/editMenu', controller.common.editMenu);
  router.post('/api/system/delMenu', controller.common.delMenu);
  router.get('/api/home/getHomeData', controller.common.getHomeData);
  router.get('/api/getMenus', controller.common.getMenus);

  // 功能接口
  router.post('/api/upload', controller.common.upload);
  router.post('/api/uploadFile', controller.common.uploadFile);
  router.post('/api/ali/uploadFile', controller.common.uploadAliFile);// 阿里云上传
  router.post('/api/uploadBurstFile', controller.common.uploadBurstFile);
  router.post('/api/merge', controller.common.merge);

  // 第三方接口
  router.post('/api/queryDetailById', controller.common.queryDetailById);// 采集漫画详情/漫画章节/章节内容
  router.post('/api/queryNovelDetail', controller.common.queryNovelDetail);// 采集小说详情/小说章节
  router.post('/api/queryVideolDetail', controller.common.queryVideolDetail);// 采集视频详情/视频集数
  router.post('/api/getCartoonLink', controller.common.getCartoonLink);// 采集漫画链接
  router.get('/api/searchKey', controller.common.searchKey);// 漫画关键字采集
  router.post('/api/getNovelLink', controller.common.getNovelLink);// 采集小说链接
  router.post('/api/getVideoLink', controller.common.getVideoLink);// 采集视频链接
};
