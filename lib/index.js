const downloadGitRepo = require('download-git-repo');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

exports.download = function(repo, destPath) {
  return new Promise((resolve, reject) => {
    downloadGitRepo(repo, destPath, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

//updatePkgJSON
exports.updatePkgJSON = function(projectName, destPath, answers) {
  return new Promise((resolve, reject) => {
    try {
      const pkgJSONPath = path.resolve(destPath, 'package.json');
      let pkgJSON = fs.readJSONSync(pkgJSONPath);
      pkgJSON['name'] = projectName;
      pkgJSON['description'] = answers.description;
      pkgJSON['version'] = answers.version;
      pkgJSON['author'] = answers.author;
      pkgJSON['repository'] = {
        type: 'git',
        url: `git+${answers.respository}`
      };
      fs.outputJsonSync(pkgJSONPath, pkgJSON);
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

exports.isValidURI = function(respository) {
  return (
    respository.match(
      /^(?:file|git|git\+ssh|git\+http|git\+https|git\+file|https?):/
    ) != null
  );
};

exports.isValidGitHub = function(respository) {
  return respository.match(/^[^/]+\/[^/]+/) != null;
};

exports.getRegistry = function(mirror = 'npm') {
  let registry = '';
  if (['taobao', 'cnpm', 'nj', 'npm', 'zyb'].includes(mirror) === false) {
    console.log(chalk.red('unsupported mirror'));
    process.exit(1);
  }
  switch (mirror) {
    case 'taobao':
      registry = 'https://registry.npm.taobao.org';
      break;
    case 'cnpm':
      registry = 'http://r.cnpmjs.org';
      break;
    case 'nj':
      registry = 'https://registry.nodejitsu.com';
      break;
    case 'npm':
      registry = 'https://registry.npmjs.org';
      break;
    case 'zyb':
      registry = 'http://fe.suanshubang.com/npm/';
      break;
    default:
      break;
  }
  return registry;
};
