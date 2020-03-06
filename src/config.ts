/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-mutable-exports */

// 使用的token
let token = '';
// npm 地址
let url = '';
// 执行的根目录
let cwd = '';

// log
let log = {
  info: (...args) => {},
  error: (...args) => {},
  debug: (...args) => {},
  success: (...args) => {},
};

export default (option: { url?: string; token?: string; cwd?: string; log? }) => {
  token = option.token || token;
  url = option.url || url;
  cwd = option.cwd || cwd;
  log = option.log || log;
};

export { token, url, cwd, log };
