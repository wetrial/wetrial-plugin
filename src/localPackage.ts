import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { cwd, url, log } from './config';
import { copyFolder, mkdirsSync } from './pathHelper';
import rimraf from 'rimraf';

// 获取文件，如果文件不存而且autoCreate为true则创建该文件
function getOrCreateFileJson(fullPath: string, autoCreate: boolean = false) {
  if (fs.existsSync(fullPath)) {
    const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    return [true, content];
  } else if (autoCreate) {
    const folderPath = path.dirname(fullPath);
    mkdirsSync(folderPath);
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

    log.info(`cd ${wetrialModulePath} | yarn add ${strPackage} --registry ${url}`);
    exec(
      `yarn add ${strPackage} --registry ${url}`,
      {
        cwd: wetrialModulePath,
      },
      error => {
        if (error) {
          log.error(error);
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            success: false,
            error,
          });
        }
        // 找文件 拷贝到pages下面去
        packages.forEach(item => {
          const sourceRoot = path.join(cwd, `./.wetrial-modules/node_modules/${item.name}`);
          // 从@wetrial/blogs 中解析出blogs
          const names = item.name.split('/');
          const moduleName = names.length > 1 ? names[names.length - 1] : names[0];
          const sourcePagesPath = path.join(sourceRoot, `./dist/pages/${moduleName}`);
          const destPagesPath = path.join(cwd, './src/pages');
          const destPagesModulePath = path.join(destPagesPath, moduleName);
          if (fs.existsSync(destPagesModulePath)) {
            log.info(`clear ${destPagesModulePath}`);
            rimraf.sync(destPagesModulePath);
            // deleteFolder(destPagesModulePath, true);
          }
          log.info(`copy folder from ${sourcePagesPath} ==> ${destPagesPath}`);
          // 页面文件
          copyFolder(sourcePagesPath, destPagesPath, true);
          // 路由文件
          const sourceRoutesPath = path.join(sourceRoot, `./dist/config/routes/${moduleName}.ts`);
          const destRoutesPath = path.join(cwd, `./config/routes/${moduleName}.ts`);
          log.info(`copy folder from ${sourceRoutesPath} ==> ${destRoutesPath}`);
          fs.copyFileSync(sourceRoutesPath, destRoutesPath);
        });

        resolve({
          success: true,
        });
      },
    );
  });
};

// 卸载包
export const unInstallPackages = async (packages: string[]) => {
  if (!packages || packages.length === 0) {
    return;
  }
  // eslint-disable-next-line no-new
  await new Promise((resolve, reject) => {
    const strPackage = packages.join(' ');
    const wetrialModulePath = path.join(cwd, '.wetrial-modules');
    // yarn add @wetrial/blogs @wetrial/template --registry http://npm.xxgtalk.cn
    log.info(`cd ${wetrialModulePath} | yarn remove ${strPackage} --registry ${url}`);
    exec(
      `yarn remove ${strPackage} --registry ${url}`,
      {
        cwd: wetrialModulePath,
      },
      error => {
        if (error) {
          log.error(error);
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            success: false,
            error,
          });
        }
        // 找文件 拷贝到pages下面去
        packages.forEach(item => {
          log.info(`un install package ${item}`);
          // 从@wetrial/blogs 中解析出blogs
          const names = item.split('/');
          const moduleName = names.length > 1 ? names[names.length - 1] : names[0];
          const destPagesPath = path.join(cwd, `./src/pages/${moduleName}`);
          if (fs.existsSync(destPagesPath)) {
            log.info(`clear ${destPagesPath}`);
            rimraf.sync(destPagesPath);
          }
          // 路由文件
          const destRoutesPath = path.join(cwd, `./config/routes/${moduleName}.ts`);
          if (fs.existsSync(destRoutesPath)) {
            log.info(`clear ${destRoutesPath}`);
            rimraf.sync(destRoutesPath);
          }
        });

        resolve({
          success: true,
        });
      },
    );
  });
};
