/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-mutable-exports */

// 使用的token
let token = '';
// npm 地址
let url = '';
// 执行的根目录
let cwd = '';

export default (option: { url?: string; token?: string; cwd?: string }) => {
  token = option.token || token;
  url = option.url || url;
  cwd = option.cwd || cwd;
};

export { token, url, cwd };
