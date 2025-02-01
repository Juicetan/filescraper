import { promises as fs } from 'fs';
import path from 'path';


const COLORREGEX = /\b(darken|lighten)\s*\(\s*([a-zA-Z#0-9$-]+)\s*,\s*(\d+%)\s*\)/g;
const IMPORTREGEX = /@import\s+['"]([^'"]+)['"];/g;

const replaceSCSSColors = (data) => {
  var colorCfgMatches = data.matchAll(COLORREGEX);
  colorCfgMatches = colorCfgMatches ? [...colorCfgMatches] : [];
  colorCfgMatches.forEach((colorCfgMatch) => {
    const wholeFind = colorCfgMatch[0];
    const fn = colorCfgMatch[1];
    const color = colorCfgMatch[2];
    const percent = colorCfgMatch[3];

    // replace darken,lighten with color.adjust
    let newStr = `color.adjust(${color}, $lightness: `;
    if(fn === 'lighten'){
      newStr += `${percent})`
    } else if(fn === 'darken'){
      newStr += `-${percent})`
    }
    data = data.replaceAll(wholeFind, newStr);
  })
  
  // add @use
  if(colorCfgMatches.length && data.indexOf('scss">') > -1){
    data = data.slice(0, data.indexOf('scss">')+6) + 
           '\n@use "sass:color";' + 
           data.slice(data.indexOf('scss">')+6); 
  }

  return data;
};

const replaceImports = (data) => {
  var importMatches = data.matchAll(IMPORTREGEX);
  importMatches = importMatches ? [...importMatches] : [];
  importMatches.forEach((importMatch) => {
    const wholeFind = importMatch[0];
    const path = importMatch[1];
    data = data.replaceAll(wholeFind, `@use "${path}" as *;`);
  });

  return data;
};

const replaceSCSSDeprecations = async (filePath) => {
  var data = await fs.readFile(filePath, 'utf-8');
  data = replaceSCSSColors(data);
  data = replaceImports(data);

  await fs.writeFile(filePath, data, 'utf-8');
};

const scssChange = async (files) => {
  files.forEach(async (f) => {
    if(path.basename(f).endsWith('.vue') || path.basename(f).endsWith('.scss') || path.basename(f).endsWith('.css')){
      await replaceSCSSDeprecations(f);
    }
  })
}

export {
  scssChange
}