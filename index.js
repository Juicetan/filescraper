import { Command } from 'commander';
import pkg from './package.json' assert { type: 'json' };
import path from 'path';

import { listFiles } from './app/controllers/fileSearcher.js';
import { extractFiles } from './app/controllers/urldownloader.js';

const processRootPath = async (pathStr) => {
  const rootPath = path.resolve(pathStr);
  const files = await listFiles(rootPath, [
    '.git', 'node_modules', 'package-lock.json', 'package.json',
    '.gitignore', 'gulpfile.js', 'index.html', 'server.js', 'README.md'
  ]);
  const options = program.opts();
  const downloadPath = options.directory ? path.resolve(options.directory) : path.resolve('./');

  await extractFiles(files, downloadPath, [
    'googleapis', 'eventbrite.ca', '.p12', 'signin', 'myonline', 
    'personal/borrow', 'about-us', 'ask-us', 'contact-us', 'and-locations',
    'google.ca'
  ]);
}

const program = new Command();
program
  .name('filescraper')
  .description('Utility to scrape URLs from text files and download them to a local folder')
  .version(pkg.version)
  .argument('<rootPath>', 'Root directory to being scanning files')
  .option('-d, --directory <path>', 'Destination directory to place downloaded files')
  .action((rootPath) => {
    processRootPath(rootPath);
  });
program.parse();
