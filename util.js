// Modules
const os = require('os')
const fs = require('fs')
const spinner = require('listr')
const path = require('path')
const { promisify } = require('util');
const exec = promisify(require('child_process').exec, { multiArgs: true })

// Create variables
const configPath = path.join(os.homedir(), '.dcorefresh.json')

// Stops, rebuilds and restarts service
refresh = async service => {
	const { err, stdout, stderr } = await exec(`
		docker-compose stop ${service} &&
		docker-compose build ${service} &&
		docker-compose up -d ${service}`
	);
	
	if (err) {
		throw new Error(err)
	}

	return stdout
}

exports.refreshServices = services => {
	const tasks = new spinner(
		services.map(service => {
			return {
				title: `Refreshing ${service}`,
				task: () => refresh(service)
			}
		})
	, {concurrent: true})

	return tasks.run()
}

exports.saveConfig = data => {
	// Create config file if it doesn't exist
	try {
		fs.statSync(configPath)
	} catch (e) {
		fs.writeFileSync(configPath, {}, 'utf8');
	}

	// Write data to config file
	fs.writeFileSync(configPath, JSON.stringify(data), 'utf8')
}

exports.readConfig = () => {
	// Make sure that config file exists
	try {
		fs.statSync(configPath)
	} catch (e) {
		return null
	}

	return JSON.parse(fs.readFileSync(configPath, 'utf8'))
}