import fetch from 'node-fetch';
import { url, token } from './config';

// 请求仓库的基类(会带上token)
function requestNPM(option: { url: string; method: string }) {
  return fetch(option.url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());
}

// 查询仓库所有包
export function getPackages() {
  return requestNPM({
    url: `${url}/-/verdaccio/search/**`,
    method: 'GET',
  }).then(response => {
    const packageRequests = response
      .map(item => item.name)
      .map(name =>
        requestNPM({
          url: `${url}/-/verdaccio/sidebar/${name}`,
          method: 'GET',
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
