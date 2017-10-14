// Modules
const fs = require('fs')
const chalk = require('chalk')
const yaml = require('js-yaml')
const { argv } = require('yargs')
const inquirer = require('inquirer')
const command_exists = require('command-exists')

// Constants
const DCO_FILE_PATH = `${process.cwd()}/docker-compose.yml`

// Util
const { refreshServices, saveConfig, readConfig } = require('./util')

// Make sure that docker-compose file exists
try {
	fs.statSync(DCO_FILE_PATH)
} catch (e) {
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


// Make sure that the docker-compose file has at least 1 service
if (dco_file.services === null) {
	console.log(chalk.bold.red('Error: docker-compose file does not contain any services'))
	process.exit(1)
}

// Extract services
const services = Object.keys(dco_file.services)


// If -r is passed, run the previously restarted services
if (argv.r) {
	const { services } = readConfig()
	refreshServices(services)
		.then(res => process.exit(0))
} else {
	// Show prompt
	inquirer.prompt([{
		type: 'checkbox',
		name: 'services',
		message: 'Which services do you want to refresh?',
		pageSize: argv.l || 20,
		choices: services
	}])
	.then(function ({ services }) {
		saveConfig({
			"path": DCO_FILE_PATH,
			"services": services
		})
		
		refreshServices(services)
	})
}