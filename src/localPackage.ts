import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { cwd, url } from './config';

// 获取文件，如果文件不存而且autoCreate为true则创建该文件
function getOrCreateFileJson(fullPath: string, autoCreate: boolean = false) {
  if (fs.existsSync(fullPath)) {
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    return [true, content];
  } else if (autoCreate) {
    fs.writeFileSync(fullPath, '{}');
  }
  return [false, undefined];
}

// registry=
// npm login --registry="https://npm.fury.io/USERNAME/"
// ~/.npmrc
// //npm.fury.io/USERNAME/:_authToken=SECRET-TOKEN
export const getLocalPackage = () => {
  const recordFullPath = path.join(cwd, '.wetrial-modules/package.json');
  const [exists, jsonContent] = getOrCreateFileJson(recordFullPath, true);
  let result = {};
  if (exists) {
    result = jsonContent.dependencies || {};
  }
  return result;
};

// 安装包到本地
export const installPackages = async (packages: { name: string; version: string }[]) => {
  if (!packages || packages.length === 0) {
    return;
  }
  // eslint-disable-next-line no-new
  await new Promise((resolve, reject) => {
    const strPackage = packages.map(item => `${item.name}@${item.version}`).join(' ');
    const wetrialModulePath = path.join(cwd, '.wetrial-modules');
    // yarn add @wetrial/blogs @wetrial/template --registry http://npm.xxgtalk.cn
    console.log(`cd ${wetrialModulePath} | yarn add ${strPackage} --registry ${url}`);
    exec(
      `yarn add ${strPackage} --registry ${url}`,
      {
        cwd: wetrialModulePath,
      },
      (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
        if (error) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            success: false,
            error,
          });
        }
        resolve({
          success: true,
        });
      },
    );
  });
};

// 卸载包
export const unInstallPackages = (packages: string[]) => {
  console.log(packages);
};
