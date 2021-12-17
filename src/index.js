require('dotenv').config({path:'../.env'});

process.env.BASE_URL = 'https://7c6e-96-44-8-65.ngrok.io'
channels = ['sudomaze', 'stuck_overflow']

const express = require('express'),
    fs = require('fs'),
    { EventEmitter } = require("events");

const {TwitchBot} = require('./TwitchBot'),
    {DiscordBot} = require('./DiscordBot'),
    {getTwitchHook} = require('./hooks/twitch'),
    {getServerHook} = require('./hooks/server');

const app = express(),
port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.raw({ type: 'application/json' })); // Need raw message body for signature verification
app.use(express.static(__dirname + '/server/public')); //Serves resources from public folder
app.set('views', __dirname+'/server/views/'); // fix issue with subdirectory
app.set('view engine', 'ejs');

// routes
const routesFiles = fs.readdirSync('./server/routes').filter(file => file.endsWith('.js'));

const emitter = new EventEmitter();

for (const file of routesFiles) {
	const router = require(`./server/routes/${file}`);
	app.use(router.path, new router.Router(emitter).router);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

app.listen(port, async () => {
    console.log(`localhost:${port}`)
    const twitchBot = new TwitchBot(channels),
        discordBot = new DiscordBot();
    twitchBot.start();
    discordBot.start();
    console.log('starting...')
    while(twitchBot.client.readyState() !== "OPEN" || !discordBot.client.isReady()) {
        await delay(1000);
        if(twitchBot.client.readyState() === "CLOSED") {
            twitchBot.disconnect();
            twitchBot.start();
        }
    }
    console.log('ready!')
    await delay(1000);
    // server api webhooks
    getServerHook(emitter, twitchBot, discordBot);
    // twitch api webhooks
    getTwitchHook(emitter, twitchBot, discordBot);
    // testing webhooks
    // emitter.emit('stream.online', ({
    //     event: {
    //         broadcaster_user_login: 'sudomaze'
    //     }
    // }))
    // emitter.emit('streamer:warning', ({discordId: '263980320926334976', message: 'test'}))

});