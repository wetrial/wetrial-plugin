// ref:
// - https://umijs.org/plugin/develop.html
import { IApi } from 'umi-types';

export default function(api: IApi, options) {
  // Example: output the webpack config
  api.chainWebpackConfig(config => {
    // console.log(config.toString());
  });

  api.addUIPlugin(require.resolve('../dist/index.umd'));

  api.onUISocket(({ action, failure, success }) => {
    // 更新代码
    if (action.type === 'org.xiexingen.wetrial-plugin.updateCode') {
      success({
        success: true,
        description: '',
        data: {
          ...action,
        },
      });
    }
    // 查询所有模块列表
    else if (action.type === 'org.xiexingen.wetrial-plugin.modules') {
      // git+ssh://git@git.mydomain.com/Username/Repository#{branch|tag}
      success({
        repositorys: [
          {
            url: 'https://github.com/wetrial/wetrial',
            tags: ['v3.0.1', 'v3.0.2', 'v3.0.3'],
            title: 'Wetrial',
            curTag: 'v3.0.1',
          },
          {
            url: 'https://github.com/xiexingen/ZuiTieXin',
            tags: ['0.1', '1.0', '1.1'],
            title: '文件列表',
            curTag: '1.0',
          },
          {
            url: 'https://github.com/xiexingen/blog',
            tags: ['0.1', '1.0', '1.1'],
            title: '博客',
            curTag: '1.0',
          },
        ],
      });
    }
  });
}
