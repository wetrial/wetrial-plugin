// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';
import { getPackagesInfo } from './package';
import { getLocalPackage, installPackages, unInstallPackages } from './localPackage';
import changeConfig from './config';

export default function(api: IApi, options) {
  changeConfig({ url: options.url, token: options.token, cwd: api.cwd, log: api.log });
  // options = {
  //   ...options,
  //   url: 'http://npm.xxgtalk.cn',
  //   token:
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWFsX2dyb3VwcyI6WyJ4aWV4aW5nZW4iXSwibmFtZSI6InhpZXhpbmdlbiIsImdyb3VwcyI6WyJ4aWV4aW5nZW4iLCIkYWxsIiwiJGF1dGhlbnRpY2F0ZWQiLCJAYWxsIiwiQGF1dGhlbnRpY2F0ZWQiLCJhbGwiLCJ4aWV4aW5nZW4iXSwiaWF0IjoxNTgzMDUyOTc5LCJuYmYiOjE1ODMwNTI5NzksImV4cCI6MTU4MzY1Nzc3OX0.zPnpQjxNQyGi07579w1cVe4GwnHCwHDZ3uGJyYdOa4o',
  // };

  // Example: output the webpack config
  api.chainWebpackConfig(() => {
    // console.log(config.toString());
  });

  api.addUIPlugin(require.resolve('../dist/index.umd'));

  api.onUISocket(async ({ action, failure, success }) => {
    // 更新代码
    if (action.type === 'org.xiexingen.wetrial-plugin.updateCode') {
      // @ts-ignore
      const { needInstalls, needUnInstalls } = action.payload;
      await installPackages(needInstalls);
      await unInstallPackages(needUnInstalls);
      success({
        success: true,
        description: '',
        data: {
          ...action,
        },
      });
    }
    // 查询所有模块列表
    else if (action.type === 'org.xiexingen.wetrial-plugin.packages') {
      try {
        getPackagesInfo({
          token: options.token,
          url: options.url,
        }).then(packages => {
          // 查询本地当前安装的情况
          const installedPackages = getLocalPackage();
          success({
            installedPackages,
            packages,
          });
        });
      } catch (error) {
        failure(error);
      }
    }
  });
}
