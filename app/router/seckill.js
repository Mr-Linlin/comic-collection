"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/api/seckill/query", controller.seckill.getTrainList);
  router.post("/api/seckill/upCookie", controller.seckill.upCookie);
  router.get("/api/music/serach", controller.seckill.serach);
};
