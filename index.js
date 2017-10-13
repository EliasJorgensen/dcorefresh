// Modules
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const yaml = require('js-yaml')
const inquirer = require('inquirer')
const command_exists = require('command-exists')

// Constants
const DCO_FILE_PATH = `${process.cwd()}/docker-compose.yml`

// Util
const { refresh } = require('./util')

// Make sure that docker-compose file exists
if (!fs.existsSync(DCO_FILE_PATH)) {
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

// Parse docker-compose file
const dco_file = yaml.safeLoad(
	fs.readFileSync(
		DCO_FILE_PATH, 'utf8'
	)
);

// Extract services
const services = Object.keys(dco_file.services)

// Show prompt
inquirer.prompt([{
	type: 'checkbox',
	name: 'services',
	message: 'Which services do you want to refresh?',
	pageSize: 40,
	choices: services
}])
.then(function ({ services }) {
	services.map(service => {
		const spinner = ora(`Refreshing ${service}`).start()
		refresh(service)
		.then((stdout) => {
			spinner.succeed()
		})
		.catch(e => {
			spinner.fail("Something went wrong:")
		})
	})
})