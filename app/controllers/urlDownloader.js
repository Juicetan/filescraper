import { promises as fs } from 'fs';
import path from 'path';

const isInIgnoreList = (testStr, ignoreList) => {
  return !!ignoreList.find((ignoreItem) => {
    return testStr.includes(ignoreItem);
  });
}

const URLPATTERN = /\bhttps?:\/\/[^\s/$.?#].[^\s]*/gi;
const extractURLs = async (filePath, ignoreList) => {
  const data = await fs.readFile(filePath, 'utf-8');
  const urls = data.match(URLPATTERN);
  return urls && [...urls].map((url) => {
    if(url.split('.png')?.length > 1){
      return url.split('.png')[0] + '.png';
    } else if(url.split('.jpg')?.length > 1){
      return url.split('.jpg')[0] + '.jpg';
    } else if(url.split('.jpeg')?.length > 1){
      return url.split('.jpeg')[0] + '.jpeg';
    } else if(url.split('.svg')?.length > 1){
      return url.split('.svg')[0] + '.svg';
    }
    return url.replaceAll('"','');
  }).filter((url) => {
    return !isInIgnoreList(url, ignoreList) && !url.endsWith('.com') && (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.svg'));
  }) || [];
}

const downloadFile = async (url, downloadPath) => {
  const fileName = path.basename(url);
  const res = await fetch(url);
  let buffer = await res.arrayBuffer();
  buffer = Buffer.from(buffer);
  await fs.writeFile(path.resolve(downloadPath, fileName), buffer);
};

const extractFiles = async (files, downloadPath, ignoreURLs) => {
  ignoreURLs = ignoreURLs || [];
  files.forEach(async (f) => {
    const urls = await extractURLs(f, ignoreURLs);
    urls.forEach(async (url) => {
      await downloadFile(url, downloadPath)
    })
  });
};

const replaceHostURLsInFile = async (filePath, newHostStr, ignoreList) => {
  var data = await fs.readFile(filePath, 'utf-8');
  var urls = data.match(URLPATTERN);
  urls = urls && [...urls].map((url) => {
    if(url.split('.png')?.length > 1){
      return url.split('.png')[0] + '.png';
    } else if(url.split('.jpg')?.length > 1){
      return url.split('.jpg')[0] + '.jpg';
    } else if(url.split('.jpeg')?.length > 1){
      return url.split('.jpeg')[0] + '.jpeg';
    } else if(url.split('.svg')?.length > 1){
      return url.split('.svg')[0] + '.svg';
    }
    return url.replaceAll('"','');
  }).filter((url) => {
    return !isInIgnoreList(url, ignoreList) && !url.endsWith('.com') && (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.svg'));
  }) || [];

  urls.forEach((urlStr) => {
    const fileName = urlStr.split('/')[urlStr.split('/').length - 1];
    const newURLStr = newHostStr + '/' + fileName;
    data = data.replaceAll(urlStr, newURLStr);
  });

  await fs.writeFile(filePath, data, 'utf-8');
};

const replaceHostURLs = async (files, newHostStr, ignoreList) => {
  ignoreList = ignoreList || [];
  files.forEach(async (f) => {
    replaceHostURLsInFile(f, newHostStr, ignoreList);
  });
};

export {
  extractFiles,
  replaceHostURLs,
}