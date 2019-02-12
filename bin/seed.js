#! /usr/bin/env node
const chalk = require('chalk');
const semver = require('semver');
const requiredVersion = require('../package.json').engines.node;

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        'You are using Node ' +
          process.version +
          ', but this version of ' +
          id +
          ' requires Node ' +
          wanted +
          '.\nPlease upgrade your Node version.'
      )
    );
    process.exit(1);
  }
}

//检查node版本
checkNodeVersion(requiredVersion, 'seed-cli');

//如果node版本符合要求，打印日志
if (semver.satisfies(process.version, '9.x')) {
  console.log(
    chalk.red(
      `You are using Node ${process.version}.\n` +
        `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
        `It's strongly recommended to use an active LTS version instead.`
    )
  );
}

const program = require('commander');
const version = require('../package.json').version;

program.version(version).usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create a new project')
  .option(
    '-m --mirror <mirror>',
    'Support mirrors: npm, taobao, cnpm, nj(nodejitsu)'
  )
  .option('-n --noInstall', 'do not execute npm install')
  .option('-y --yarn', 'use yarn instead of npm')
  .option('-f --force', 'Overwrite target directory if it exists')
  .action((projectName, cmd) => {
    const options = cleanArgs(cmd);
    require('../commander/create')(projectName, options);
  });

// output help information on unknown commands
program.arguments('<command>').action(cmd => {
  program.outputHelp();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
  console.log();
});

// add some useful info on help
program.on('--help', () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `seed <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

program.commands.forEach(c => c.on('--help', () => console.log()));

program.parse(process.argv);

/**hellow-word to helloWord */
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}
// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''));
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}
