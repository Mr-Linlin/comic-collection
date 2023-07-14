'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/user')(app);
  require('./router/common')(app);
  require('./router/cartoonManage')(app);
  require('./router/novel')(app);
  require('./router/seckill')(app);
};
