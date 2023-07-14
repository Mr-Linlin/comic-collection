'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 漫画分类
  router.post('/api/product/editCtcategory', controller.cartoonManage.editCtcategory);
  router.post('/api/cartoon/addCategory', controller.cartoonManage.addCtcategory);
  router.post('/api/product/deleteCtcategory', controller.cartoonManage.deleteCtcategory);
  router.get('/api/product/getCtcategory', controller.cartoonManage.getCategory);

  // 漫画列表
  router.get('/api/product/getCartoonList', controller.cartoonManage.getCartoonList);
  router.post('/api/product/addCartoon', controller.cartoonManage.addCartoon);
  router.post('/api/product/editCartoon', controller.cartoonManage.editCartoon);
  router.post('/api/product/deleteCartoon', controller.cartoonManage.deleteCartoon);
  router.get('/api/product/getCartoonDetail', controller.cartoonManage.getCartoonDetail);
  // 章节模块
  router.post('/api/cartoon/addChapter', controller.cartoonManage.addChapter);
  router.get('/api/cartoon/getChapterList', controller.cartoonManage.getChapterList);
  router.post('/api/cartoon/addChapterPage', controller.cartoonManage.addChapterPage);
  router.get('/api/cartoon/getChapterPage', controller.cartoonManage.getChapterPage);

  // 移动端
  router.get('/api/product/queryCartoon', controller.cartoonManage.queryCartoon);// 漫画模糊搜索
  router.get('/api/cartoon/historicalRecord', controller.cartoonManage.getRecord);// 漫画历史记录
  router.post('/api/chapter/read/add/', controller.cartoonManage.readAdd);// 添加阅读记录

  // 系统管理模块
  // 角色模块
  router.get('/api/system/role', controller.cartoonManage.getRoles);
  router.post('/api/system/addRole', controller.cartoonManage.addRole);
  router.post('/api/system/editRole', controller.cartoonManage.editRole);
  router.post('/api/system/deleteRole', controller.cartoonManage.deleteRole);

  // 账号模块
  router.get('/api/system/account', controller.cartoonManage.getAccounts);
  router.post('/api/system/addAccount', controller.cartoonManage.addAccount);
  router.post('/api/system/editAccount', controller.cartoonManage.editAccount);
  router.post('/api/system/deleteAccount', controller.cartoonManage.deleteAccount);
};
