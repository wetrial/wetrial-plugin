import { join } from 'path';
import { IConfig } from 'umi-types';

export default {
  routes: [{ path: '/', component: './index' }],
  plugins: [
    [
      join(__dirname, '..', require('../package').main || 'index.js'),
      {
        url: 'http://npm.xxgtalk.cn',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWFsX2dyb3VwcyI6WyJ4aWV4aW5nZW4iXSwibmFtZSI6InhpZXhpbmdlbiIsImdyb3VwcyI6WyJ4aWV4aW5nZW4iLCIkYWxsIiwiJGF1dGhlbnRpY2F0ZWQiLCJAYWxsIiwiQGF1dGhlbnRpY2F0ZWQiLCJhbGwiLCJ4aWV4aW5nZW4iXSwiaWF0IjoxNTgzMDUyOTc5LCJuYmYiOjE1ODMwNTI5NzksImV4cCI6MTU4MzY1Nzc3OX0.zPnpQjxNQyGi07579w1cVe4GwnHCwHDZ3uGJyYdOa4o',
      },
    ],
  ],
} as IConfig;
