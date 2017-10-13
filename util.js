// Modules
const { promisify } = require('util');
const exec = promisify(require('child_process').exec, { multiArgs: true })

// Kills, rebuilds and restarts service
exports.refresh = async function(service) {
	const { err, stdout, stderr } = await exec(`
		docker-compose kill ${service} &&
		docker-compose build ${service} &&
		docker-compose up -d ${service}`
	);
	
	if (err) {
		throw new Error(err)
	}

	return stdout
}