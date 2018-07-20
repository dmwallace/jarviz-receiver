import express from 'express'
import os from 'os';
import {spawn, exec} from 'child_process';
import bodyParser from 'body-parser';
import cors from 'cors';
import fkill from 'fkill';
import net from 'net';
var fs = require('fs');

let packageJSON = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf8'));
console.log("\n----------------------------------------------------------------------");
console.log(`Jarviz Receiver version: ${packageJSON.version}\n`);
console.log(`Hostname: ${os.hostname()}\n`);
console.log("Network Interfaces:");

var ifaces = os.networkInterfaces();

var currentAppId;
var currentScenarioId;

Object.keys(ifaces).forEach(function (ifname) {
	var alias = 0;
	
	ifaces[ifname].forEach(function (iface) {
		if ('IPv4' !== iface.family || iface.internal !== false) {
			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			return;
		}
		
		if (alias >= 1) {
			// this single interface has multiple ipv4 addresses
			console.log(ifname + ':' + alias, iface.address);
		} else {
			// this interface has only one ipv4 adress
			console.log(ifname, iface.address);
		}
		++alias;
	});
});
console.log("----------------------------------------------------------------------\n");


const app = express();
app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

let child = null;

//process.on('unhandledRejection', r => console.log(r))

app.post(`/telnet`, async (req, res) => {
	console.log(`\n\n${new Date().toISOString()} NEW TELNET COMMAND ---------------------------`);
	console.log("req.body", req.body);
	
	try {
		let result = await sendTelnetCommand(req.body);
		res.send(JSON.stringify({result}));
	} catch (error) {
		res.send(JSON.stringify({error: error.toString()}))
	}
});

app.get('/ping', async (req, res) => {
	console.log(`\n\n${new Date().toISOString()} PING REQUEST ---------------------------`);
	
	let response = {
		hostname: os.hostname()
	};
	
	console.log("response", response);
	
	res.send(JSON.stringify(response));
});

app.get('/poll', async (req, res)=>{
	let response = {
		hostname: os.hostname()
	}
})

app.post('/kill', async (req, res) => {
	console.log(`\n\n${new Date().toISOString()} NEW KILL REQUEST ---------------------------`);
	
	let {results, errors} = await killProcess();
	
	res.send(JSON.stringify({results, errors}));
});

async function spawnChild({id, command, cwd, args}) {
	let {results, errors} = await killProcess();
	
	
	console.log("spawning");
	
	if(args && args.length) {
		args = args.split(' ');
	}
	
	child = spawn(
		command,
		args,
		{
			cwd
		}
	);
	
	
	child.stdout.on('data', function (data) {
		//console.log('stdout: ' + data);
	});
	child.stderr.on('data', function (data) {
		//console.log('stdout: ' + data);
	});
	child.on('close', function (code) {
		//console.log(`Child ${child.spawnfile} PID: ${child.pid} closed with code: ${code}`);
	});
	child.on('error', (err) => {
		if (err) console.log(err);
		errors.push(err);
	});
	
	/*let executeCommand = `"${cwd}${command}" ${args}`;
	console.log("executeCommand", executeCommand);
	
	child = exec(executeCommand, (error, stdout, stderr) => {
		 if (error) {
			  console.error(`exec error: ${error}`);
			  errors.push(error);
		 } else {
			  results.push(stdout);
			  errors.push(stderr);
		 }
	});

	console.log("child", child);*/
	
	if (child) {
		child.processName = command;
		results.push(`spawned process ${child.spawnfile} with PID: ${child.pid}`);
		res.send(JSON.stringify({results, errors}));
		console.log("\nRESULTS:", JSON.stringify(results, null, 3));
		console.log("ERRORS:", JSON.stringify(errors, null, 3));
	} else {
		setTimeout(() => { // wait for application launch errors
			res.send(JSON.stringify({results, errors}));
			console.log("\nRESULTS:", JSON.stringify(results, null, 3));
			console.log("ERRORS:", JSON.stringify(errors, null, 3));
		}, 1000);
	}
}

app.post('/launch', async (req, res) => {
	console.log(`\n\n${new Date().toISOString()} NEW LAUNCH REQUEST ---------------------------`);
	
	console.log("req.body", req.body);
	
	spawnChild(req.body);
	
	
});


async function killProcess() {
	let results = [];
	let errors = [];
	
	if (child && child.pid) {
		console.log("killing");
		console.log("child.pid", child.pid);
		
		await fkill(child.pid, {force: true}).then(() => {
			results.push(`process with PID: ${child.pid} successfully terminated`);
		}).catch((err) => {
			console.log(`\nCant kill process by PID: ${child.pid}, attempting to kill by name: ${child.processName || child.spawnfile}`);
			//if (err) console.error(err);
			
			fkill(child.processName || child.spawnfile, {force: true}).then(() => {
				results.push(`process with name: ${child.spawnfile} successfully terminated`);
			}).catch((err) => {
				if (child && child.pid) { // swallow some errors related to nonexistant processes so long as child has been killed
					if (err) console.error(err);
					errors.push(`could not kill process with PID: ${child.pid} \n${JSON.stringify(err)}`);
				}
			});
		});
		
		console.log("done");
		
		
		child = null;
	}
	
	console.log("\nRESULTS:", JSON.stringify(results, null, 3));
	console.log("ERRORS:", JSON.stringify(errors, null, 3));
	
	return {results, errors};
}

var telnetBusy = false;
var telnetQueue = [];

function popTelnetQueue() {
	if (telnetQueue.length > 0) {
		sendTelnetCommand(telnetQueue.shift());
	}
}

async function sendTelnetCommand({cmd, host, port, username, retries=0, deferred = new Deferred()}) {
	console.log("telnetBusy", telnetBusy);
	if (telnetBusy) {
		// if telnet is busy the command plus a deferred promise for returning the result to the calling function is pushed to a queue
		
		telnetQueue.push({cmd, host, port, username, retries: retries+1, deferred});
		console.log("telnetQueue.length", telnetQueue.length);
		
		return deferred.promise;
	}
	
	console.log(`sendTelnetCommand(${cmd})`);
	
	telnetBusy = true;
	
	var socket = net.connect(port, host, function () {
		console.log("Sending data");
		//socket.write("hello\r\n")
		console.log("Telnet connection ready");
		
		let onDataCount = 0;
		
		socket.on("data", function (data) {
			onDataCount++;
			console.log("\nreceived data");
			console.log(data);
			
			
			console.log(data.toString());
			console.log("onDataCount", onDataCount);
			
			switch (onDataCount) {
				case 1:
					// login
					console.log("login");
					socket.write(`${username}\r\n`);
					break;
				case 2:
					// carriage return
					console.log("send carriage return");
					socket.write("\r\n");
					break;
				case 3:
					// command
					console.log(`send data: ${cmd}\r\n`);
					socket.write(`${cmd}\r\n`);
					break;
				default:
					console.log("closing telnet connection");
					socket.end();
					deferred.resolve(`Telnet command: ${cmd} sent successfully to ${host}:${port}`);
					telnetBusy = false;
					popTelnetQueue();
					break;
			}
		})
	});
	
	
	socket.on("error", function(err) {
		console.log(err);
		
		deferred.reject(new Error(`Failed to send Telnet command: ${cmd} to ${host}:${port}\n${err.message}`));
		
		telnetBusy = false;
		popTelnetQueue();
	});
	
	return deferred.promise;
}


class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		})
	}
}

export default app
