import { promises as fs } from 'fs';
import path from 'path';

const isInIgnoreList = (testStr, ignoreList) => {
  return !!ignoreList.find((ignoreItem) => {
    return testStr.includes(ignoreItem);
  });
}

const listFiles = async function(dir, ignore){
  ignore = ignore || [];
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() && !isInIgnoreList(res, ignore) ? listFiles(res) : res;
  }));
  return Array.prototype.concat(...files).filter((f) => {
    return !isInIgnoreList(f, ignore);
  });
}

export { 
  listFiles
}