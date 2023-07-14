//  app/middleware/init.js
// 初始化中间件
'use strict';
module.exports = () => {
  return async (ctx, next) => {
    ctx.rBody = (code = 200, msg = '', data = {}) => {
      ctx.status = code;
      ctx.body = { code, msg, data, time: Math.floor(Date.now()) };
      return;
    };
    await next();
  };
};

