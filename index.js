// Modules
const command_exists = require('command-exists')
const { exec } = require('child_process')
const inquirer = require('inquirer')
const chalk = require('chalk')
const yaml = require('js-yaml')
const fs = require('fs')

// Constants
const DCO_FILE = `${process.cwd()}/docker-compose.yml`

// Make sure that DCO_FILE exists
if (!fs.existsSync(DCO_FILE)) {
	console.log(chalk.bold.red('Error: No docker-compose.yml file in current directory'))
	process.exit(1)
}

// Make sure that user has docker-compose installed
command_exists('docker-compose', (err, command_exists) => {
	if (!command_exists) {
		console.log(chalk.bold.red('Error: docker-compose is not installed'))
		process.exit(1)
	}
})

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
	console.log(JSON.stringify(answers, null, '  '))
})