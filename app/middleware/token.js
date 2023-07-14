// token校验中间件
'use strict';
// const sd = require('silly-datetime');
module.exports = () => {
  return async (ctx, next) => {
    // console.log(new Date(sd.format('2022-05-02 23:00', 'YYYY-MM-DD HH:mm')).getTime() / 1000);
    // console.log(sd.format(1651142081 * 1000, 'YYYY-MM-DD HH:mm'));
    let token = ctx.request.header.token;
    // console.log(token,'token');
    if (!token) return ctx.rBody(401, 'token不存在');
    token = token ? token.split('Bearer ')[1] : null;
    if (token) {
      try {
        const { iat } = await ctx.service.user.verifyToken(token);
        const newTime = new Date().getTime();
        const time = parseInt(newTime / 1000) - iat;
        // console.log(time, '验证成功', iat);
        if (time > 86400) {
          return ctx.rBody(401, '身份验证失败,token令牌过期');
        }
      } catch (error) {
        return ctx.rBody(401, '身份验证失败,token令牌无效');
      }
    } else {
      return ctx.rBody(401, 'token信息格式错误！');
    }
    await next();
  };
};
// token的设置，在登陆时设置相应session

