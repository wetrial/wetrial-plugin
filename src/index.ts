// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';
import { getPackages } from './package';
import { getLocalPackage, installPackages, unInstallPackages } from './localPackage';
import changeConfig from './config';

export default function(api: IApi, options) {
  changeConfig({ url: options.url, token: options.token, cwd: api.cwd, log: api.log });

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
        getPackages().then(packages => {
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
