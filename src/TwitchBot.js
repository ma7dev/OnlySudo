require('dotenv').config({path:'../.env'});

const fs = require('fs'),
    tmi = require('tmi.js'),
    { Collection } = require('discord.js');

class TwitchBot {
    constructor(channels, emitter) {
        console.log(channels)
        this.client = new tmi.Client({
            options: { 
                debug: true, 
                messagesLogLevel: "info" 
            },
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: `${process.env.TWITCH_BOT_USERNAME}`,
                password: `oauth:${process.env.TWITCH_ACCESS_TOKEN}`
            },
            channels
        });
        this.client.emitter = emitter
        // commands
        this.client.commands = new Collection();

        const commandFiles = fs.readdirSync("./twitch/commands").filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`./twitch/commands/${file}`);
            this.client.commands.set(command.name, command);
        }

        // events
        const eventFiles = fs.readdirSync('./twitch/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`./twitch/events/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(this.client,...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(this.client,...args));
            }
        }
    }
    start() {
        console.log('starting...')
        this.client.connect().catch(err => console.log(err));
    }
    disconnect() {
        console.log('disconnecting...')
        this.client.disconnect()
        .then((data) => {
            // data returns [server, port]
        }).catch(err => console.log(err));
    }
    restart(){
        console.log('restarting...')
        this.client.disconnect().catch(err => console.log(err));
        this.start();
    }
    join(channel) {
        this.client.join(channel).catch(err => console.log(err));
    }
    leave(channel) {
        this.client.part(channel).catch(err => console.log(err));
    }
    host(channel, target) {
        this.client.host(channel, target).catch(err => console.log(err));
    }
    // TODO: to verify a user, send a message to whisper
    
}

module.exports = { TwitchBot };