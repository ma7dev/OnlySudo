require('dotenv').config({path:'../.env'});

process.env.BASE_URL = 'https://9d8d-96-44-8-65.ngrok.io'

const express = require('express'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    { EventEmitter } = require("events");

const {TwitchBot} = require('./TwitchBot'),
    {DiscordBot} = require('./DiscordBot');

const app = express(),
port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.raw({ type: 'application/json' })); // Need raw message body for signature verification
app.use(express.static(__dirname + '/server/public')); //Serves resources from public folder
app.set('views', __dirname+'/server/views/'); // fix issue with subdirectory
app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tlsCAFile: "../ca-certificate.crt"
    }).catch(err => {
        console.error(err.stack)
        process.exit(1)
    });
}

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
    const channels = ['sudomaze']
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

});