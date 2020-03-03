import fetch from 'node-fetch';

// 请求仓库的基类(会带上token)
function requestNPM(option) {
  return fetch(option.url, {
    method: option.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${option.token}`,
    },
  }).then(res => res.json());
}

// 查询仓库所有包
function getPackages(option: { url: string; token: string }) {
  return requestNPM({
    url: `${option.url}/-/verdaccio/search/**`,
    token: option.token,
    method: 'GET',
  }).then(response => {
    const packageRequests = response
      .map(item => item.name)
      .map(name =>
        requestNPM({
          url: `${option.url}/-/verdaccio/sidebar/${name}`,
          method: 'GET',
          token: option.token,
        }),
      );
    return Promise.all(packageRequests).then(responses => {
      return responses.map((item: any) => {
        return {
          title: item._id,
          tags: Object.keys(item.versions),
          lastest: item['dist-tags'].latest,
        };
      });
    });
  });
}

// 获取远程仓库包情况
export function getPackagesInfo(option: { url: string; token: string }) {
  return getPackages(option);
}
