const inquirer = require('inquirer')
const {exec} = require('child_process')
const yaml = require('js-yaml')
const fs = require('fs')

try {
  const doc = yaml.safeLoad(fs.readFileSync(
    '/Users/elias/Projects/Code/HTML24/koebt_bornholm/docker-compose.yml', 'utf8'
    ));
  
  const services = Object.keys(doc.services)

  inquirer.prompt([{
    type: 'checkbox',
    name: 'theme',
    message: 'Which services do you want to refresh?',
    pageSize: 1000,
    choices: services
  }]).then(function (answers) {
  console.log(JSON.stringify(answers, null, '  '));
})

} catch (e) {
  console.log(e);
}