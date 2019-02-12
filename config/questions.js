//tpl模板地址
const tplList = require(`${__dirname}/../templates.json`);
const tplChoices = Object.keys(tplList) || [];

//questions
const templates = {
  type: 'list',
  name: 'template',
  message: 'which template to use?',
  choices: tplChoices,
  default: tplChoices[0]
};

const questions = [
  {
    type: 'input',
    name: 'respository',
    message: 'project respository url'
  },
  {
    type: 'input',
    name: 'version',
    message: 'project version',
    default: '0.0.1'
  },
  {
    type: 'input',
    name: 'description',
    message: 'project description',
    default: 'description'
  },
  {
    type: 'input',
    name: 'author',
    message: 'project author',
    default: 'unknow'
  },
  {
    type: 'confirm',
    name: 'yes',
    message: 'Are your sure about above answers?'
  }
];

module.exports = function(options) {
  // let repo=options.repo;
  // if (options.repo) {
  //   if (!isValidGitHub(repo) || !isValidURI(repo)) {
  //     warn(
  //       `invalid repository url"`
  //     )

  //   }
  // }else{

  // }
  return [templates].concat(questions);
};
