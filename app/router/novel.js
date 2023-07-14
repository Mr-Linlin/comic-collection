'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // 小说分类模块
  router.post('/api/novel/editCtcategory', controller.novel.editCtcategory);
  router.post('/api/novel/addCategory', controller.novel.addCtcategory);
  router.post('/api/novel/deleteCtcategory', controller.novel.deleteCtcategory);
  router.get('/api/novel/getCtcategory', controller.novel.getCategory);

  // 小说列表
  router.get('/api/novel/getCartoonList', controller.novel.getCartoonList);
  router.post('/api/novel/addCartoon', controller.novel.addCartoon);
  router.post('/api/novel/editCartoon', controller.novel.editCartoon);
  router.post('/api/novel/deleteCartoon', controller.novel.deleteCartoon);
  router.get('/api/novel/getCartoonDetail', controller.novel.getCartoonDetail);

  // 章节模块
  router.post('/api/novel/addChapter', controller.novel.addChapter);
  router.get('/api/novel/getChapterList', controller.novel.getChapterList);
  router.post('/api/novel/editChapter', controller.novel.editChapter);
  router.post('/api/novel/deleteChapter', controller.novel.deleteChapter);

  // 移动端
  router.get('/api/novel/getNovelPage', controller.novel.getNovelPage);

  // 视频分类模块
  router.post('/api/video/editCtcategory', controller.novel.editVideoCtcategory);
  router.post('/api/video/addCategory', controller.novel.addVideoCtcategory);
  router.post('/api/video/deleteCtcategory', controller.novel.deleteVideoCtcategory);
  router.get('/api/video/getCtcategory', controller.novel.getVideoCategory);

  // 视频列表模块
  router.get('/api/video/getCartoonList', controller.novel.getVideoList);
  router.post('/api/video/addCartoon', controller.novel.addVideo);
  router.post('/api/video/editCartoon', controller.novel.editVideo);
  router.post('/api/video/deleteCartoon', controller.novel.deleteVideo);
  router.get('/api/video/getCartoonDetail', controller.novel.getVideoDetail);

  // 剧集模块
  router.post('/api/video/addChapter', controller.novel.addVideoChapter);
  router.get('/api/video/getChapterList', controller.novel.getVideoChapterList);
  router.post('/api/video/editChapter', controller.novel.editVideoChapter);
  router.post('/api/video/deleteChapter', controller.novel.deleteVideoChapter);

  // 影视工厂
  router.get('/api/video/getVideoPage', controller.novel.getVideoPage);

};
