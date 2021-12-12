require("dotenv").config({ path: "../../.env" });

const fs = require("fs"),
    { Client } = require("tmi.js"),
    { Collection } = require("discord.js");

// client
const client = new Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true,
    },
    identity: {
        username: `${process.env.TWITCH_BOT_USERNAME}`,
        password: `oauth:${process.env.TWITCH_ACCESS_TOKEN}`,
    },
    channels: [`${process.env.TWITCH_CHANNEL}` ],
});

// commands
client.commands = new Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// events
const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.connect().catch(console.error);
