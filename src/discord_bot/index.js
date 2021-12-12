require("dotenv").config({ path: "../../.env" });

const fs = require("fs"),
    { Client, Collection, Intents } = require("discord.js");

// client
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// commands
client.commands = new Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
// const permissions = require('./permissions');

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // await command.permissions.add({ permissions });
    client.commands.set(command.data.name, command);
}

// events
const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => {
            event.execute(client, ...args);
        });
    } else {
        client.on(event.name, (...args) => {
            event.execute(client, ...args);
        });
    }
}

client.login(process.env.DISCORD_TOKEN);
