'use strict';

class HttpExceptions extends Error {
  constructor(msg = '服务器异常', code = 201, httpCode = 400) {
    super();
    this.code = code;
    this.msg = msg;
    this.httpCode = httpCode;
  }
}

module.exports = { HttpExceptions };
