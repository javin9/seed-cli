const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const rm = require('rimraf').sync;
const path = require('path');
const generator = require('../lib/generator.js');

//create
async function create(projectName, options) {
  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, projectName || '.'); //目录地址

  //检查project-name是否合法
  const result = validateProjectName(projectName);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`));
    result.errors &&
      result.errors.forEach(err => {
        console.error(chalk.red.dim('Error: ' + err));
      });
    result.warnings &&
      result.warnings.forEach(warn => {
        console.error(chalk.red.dim('Warning: ' + warn));
      });
    process.exit(1);
  }

  //检查文件路径是否存在
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      rm(targetDir); //删除
      ask(projectName, options, targetDir);
    } else {
      const { yes } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'yes',
          message: 'current project directory is not empty,continue?'
        }
      ]);

      if (!yes) {
        return;
      } else {
        rm(targetDir); //删除
        ask(projectName, options, targetDir);
      }
    }
  } else {
    ask(projectName, options, targetDir);
  }
}

function ask(projectName, options, targetDir) {
  const questions = require('../config/questions.js')(options); //
  inquirer.prompt(questions).then(answers => {
    generator(answers, projectName, options, targetDir);
  });
}

module.exports = (projectName, options) => {
  return create(projectName, options);
};
