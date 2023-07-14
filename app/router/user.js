'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/user/login', controller.user.login);
  router.post('/user/reg', controller.user.register);
  router.post('/user/wxLogin', controller.user.wxLogin);
};
