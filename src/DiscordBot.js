require('dotenv').config({path:'../.env'});

const fs = require('fs'),
    discord  = require("discord.js"),
    { Collection, Intents } = require('discord.js');

function getDate() {
    return Math.floor(Date.now()/ 1000);
}
class DiscordBot {
    constructor() {
        this.guild = null;
        this.twitchBadge = null;

        this.client = new discord.Client({ 
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.GUILD_WEBHOOKS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_MESSAGE_TYPING,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            ] 
        });


        // commands
        this.client.commands = new Collection();

        const commandFiles = fs.readdirSync("./discord/commands").filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`./discord/commands/${file}`);
            this.client.commands.set(command.data.name, command);
        }

        // events
        const eventFiles = fs.readdirSync('./discord/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`./discord/events/${file}`);
            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(this.client,...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(this.client,...args));
            }
        }
    }
    start() {
        this.client.login(process.env.DISCORD_TOKEN)
        .catch(console.error);
    }
    restart() {
        console.log('restarting...')
        this.client.destroy()
        .then(() => {
            this.start();
        });
    }
    sendMessage(channelId, message) {
        const channel = this.guild.channels.cache.get(channelId);
        channel.send(message);

    }
    sendDM(discordId, message) {
        const user = this.client.users.cache.get(discordId);
        user.send(message);
    }
    log(message) {
        console.log(message);
        // this.logChannel.send(`<t:${getDate()}:f> ${message}`);
    }
}

module.exports = { DiscordBot };