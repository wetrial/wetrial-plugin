import path from 'path';
import fs from 'fs';

/**
 * 删除指定文件
 * @param delPath 要删除的文件
 * @param isAbsolute 是否绝对路径
 */
function deleteFile(delPath, isAbsolute: boolean) {
  let deletePath = delPath;
  deletePath = isAbsolute ? path : path.join(__dirname, deletePath);
  try {
    if (fs.existsSync(deletePath)) {
      fs.unlinkSync(deletePath);
    } else {
      console.log('inexistence path：', deletePath);
    }
  } catch (error) {
    console.log('del error', error);
  }
}

/**
 * 拷贝文件夹
 * @param sourcePath 源目录
 * @param destPath 目标目录
 * @param isAbsolutePath 是否绝对路径
 */
export function copyFolder(source: string, dest: string, isAbsolutePath: boolean) {
  let sourcePath = source;
  let destPath = dest;
  if (!isAbsolutePath) {
    sourcePath = path.join(__dirname, sourcePath);
    destPath = path.join(__dirname, destPath);
  }

  function createDir(dirPath) {
    fs.mkdirSync(dirPath);
  }

  if (fs.existsSync(sourcePath)) {
    createDir(destPath);

    const files = fs.readdirSync(sourcePath, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
      const cf = files[i];
      const ccp = path.join(sourcePath, cf.name);
      const crp = path.join(destPath, cf.name);
      if (cf.isFile()) {
        /**
         * @des 创建文件,使用流的形式可以读写大文件
         */
        const readStream = fs.createReadStream(ccp);
        const writeStream = fs.createWriteStream(crp);
        readStream.pipe(writeStream);
      } else {
        try {
          /**
           * @des 判断读(R_OK | W_OK)写权限
           */
          fs.accessSync(path.join(crp, '..'), fs.constants.W_OK);
          copyFolder(ccp, crp, true);
        } catch (error) {
          console.log('folder write error:', error);
        }
      }
    }
  } else {
    console.log('do not exist path: ', sourcePath);
  }
}

/**
 * 删除文件夹
 * @param source
 */
export function deleteFolder(source: string, isAbsolute: boolean = true) {
  let delPath = source;
  delPath = isAbsolute ? delPath : path.join(__dirname, delPath);

  try {
    if (fs.existsSync(delPath)) {
      const delFn = address => {
        const files = fs.readdirSync(address);
        for (let i = 0; i < files.length; i++) {
          const dirPath = path.join(address, files[i]);
          if (fs.statSync(dirPath).isDirectory()) {
            delFn(dirPath);
          } else {
            deleteFile(dirPath, true);
          }
        }
        /**
         * @des 只能删空文件夹
         */
        fs.rmdirSync(address);
      };
      delFn(delPath);
    } else {
      console.log('do not exist: ', delPath);
    }
  } catch (error) {
    console.log('del folder error', error);
  }
}
