module.exports.deploy = function *deploy(ctx) {
  var spawn = require('child_process').spawn,
		deploy = spawn('sh', ['./deploy.sh']);

	deploy.stdout.on('data', function(data) {
		console.log('' + data);
	});

	deploy.on('close', function(code) {
		console.log('Child process exited with code ' + code);
	});
	
	this.body = 'Github Hook received!'
	
};
