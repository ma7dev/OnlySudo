require("dotenv").config({ path: ".env" });
jest.useFakeTimers();
const fs = require("fs"),
    tmi = require("tmi.js"),
    { Collection } = require("discord.js");

const WebSocketServer = require('ws').Server;
const noop = function() {};

const catchConnectError = err => {
	if(err !== 'Connection closed.') {
		console.error(err);
	}
};

const tests = [ 
    {
        command: 'ping',
        inputParams: [],
        returnedParams: [],
        serverTest: '/ping',
        serverCommand: 'ping',
    }
];
let user, guild, channel, channel_projects, msg;
describe("testing commands", () => {   
	beforeEach(function() {
		// Initialize websocket server
		this.server = new WebSocketServer({ port: 7000 });
		this.client = new tmi.client({
			connection: {
				server: 'localhost',
				port: 7000,
				timeout: 1,
				reconnect: false
			}
		});
	});

	afterEach(function() {
		// Shut down websocket server
		this.server.close();
		this.client = null;
	});

	it('handles commands when disconnected', function(cb) {
		this.client.subscribers('local7000').then(noop, err => {
			err.should.containEql('Not connected to server.');
			cb();
		});
	});
    tests.forEach(test => {
		it(`should handle ${test.command}`, function(cb) {
			const { client, server } = this;

			server.on('connection', ws => {
				ws.on('message', message => {
					// Ensure that the message starts with NICK
					if(!message.indexOf('NICK')) {
						const user = client.getUsername();
						ws.send(`:${user}! JOIN #local7000`);
						return;
					}
					// Otherwise, send the command
					if(~message.indexOf(test.serverTest)) {
						if(typeof test.serverCommand === 'function') {
							test.serverCommand(client, ws);
						}
						else {
							ws.send(test.serverCommand);
						}
					}
				});
			});

			client.on('join', function() {
				client[test.command].apply(this, test.inputParams).then(data => {
					test.returnedParams.forEach((param, index) => {
						data[index].should.eql(param);
					});
					client.disconnect();
					cb();
				});
			});

			client.connect().catch(catchConnectError);
		});

		if(test.errorCommands) {
			test.errorCommands.forEach(error => {
				it(`should handle ${test.command} errors`, function(cb) {
					const { client, server } = this;

					server.on('connection', ws => {
						ws.on('message', message => {
							// Ensure that the message starts with NICK
							if(!message.indexOf('NICK')) {
								const user = client.getUsername();
								ws.send(`:${user}! JOIN #local7000`);
								return;
							}
							// Otherwise, send the command
							if(~message.indexOf(test.serverTest)) {
								ws.send(error);
							}
						});
					});

					client.on('join', function() {
						client[test.command].apply(this, test.inputParams).then(noop, err => {
							err.should.be.ok();
							client.disconnect();
							cb();
						});
					});

					client.connect().catch(catchConnectError);
				});
			});
		}

		if(test.testTimeout) {
			it(`should handle ${test.command} timeout`, function(cb) {
				const { client, server } = this;

				server.on('connection', ws => {
					ws.on('message', message => {
						// Ensure that the message starts with NICK
						if(!message.indexOf('NICK')) {
							ws.send('dummy');
							return;
						}
					});
				});

				client.on('logon', function() {
					client[test.command].apply(this, test.inputParams).then(noop, err => {
						err.should.be.ok();
						client.disconnect();
						cb();
					});
				});

				client.connect().catch(catchConnectError);
			});
		}
	});
});
    // tests.forEach(test => {
    // events
    // const eventFiles = fs
    //     .readdirSync("./src/twitch_bot/events")
    //     .filter((file) => file.endsWith(".js"));

    // for (const file of eventFiles) {
    //     const event = require(`../../../src/twitch_bot/events/${file}`);
    //     if (event.once) {
    //         this.client.once(event.name, (...args) => event.execute(this.client, ...args));
    //     } else {
    //         this.client.on(event.name, (...args) => event.execute(this.client, ...args));
    //     }
    // }
    // this.client.connect().catch(console.error);
    // var cmd = this.client.commands.get("ping");
    // it(`test ${cmd.name}`, async () => {
    //     msg.channel.send = jest.fn();
    //     cmd.execute(msg);
    // });