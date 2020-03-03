import path from 'path';
import fs from 'fs';

function getOrCreateFileJson(fullPath: string) {
  if (fs.existsSync(fullPath)) {
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    return [true, content];
  }
  return [false, undefined];
}

// registry=
// npm login --registry="https://npm.fury.io/USERNAME/"
// ~/.npmrc
// //npm.fury.io/USERNAME/:_authToken=SECRET-TOKEN
export const getLocalPackage = (option: { cwd: string }) => {
  const { cwd } = option;
  const recordFullPath = path.join(cwd, '.wetrial-modules/package.json');
  const [exists, jsonContent] = getOrCreateFileJson(recordFullPath);
  let result = {};
  if (exists) {
    result = jsonContent.deps || {};
  }
  return result;
};

// 安装包到本地
export const installPackages = (packages: { name: string; versino: string }[]) => {
  console.log(packages);
};

// 卸载包
export const unInstallPackages = (packages: string[]) => {
  console.log(packages);
};
