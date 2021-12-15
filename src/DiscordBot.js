require('dotenv').config({path:'../.env'});

const fs = require('fs'),
    discord  = require("discord.js"),
    { Collection, Intents } = require('discord.js'),
    { promisify } = require('util');

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
    // update stream-notification channel
    updateStreamNotificationChannel(channel) {

    }
    sendMessage(channelId, message) {
        const channel = this.guild.channels.cache.get(channelId);
        channel.send(message);

    }
    liveNotification(channelId, streamer) {
        const channel = this.guild.channels.cache.get(channelId),
            message = `Hey @everyone, <@${streamer.discordId}> has gone live on Twitch Watch them here: \n`
            + `https://www.twitch.tv/${streamer.twitchName}`;
        channel.send(message);

    }
    liveEmbed(rank, streamers) {
        const channel = this.guild.channels.cache.get(rank.channelId);
        if(!rank.messageId) {
            const embed = generateEmbed(rank,streamers);
            channel.send(embed);
            rank.messageId = embed.id;
        }
        else {
            rank.messageId.edit(generateEmbed(rank,streamers))
        }
        // check if bot sent a message before
        // if yes, update it
        // else, create a new one
    }
    // update stats channels
    // update featured
    // update levels
    // backup
    // logs
}

module.exports = { DiscordBot };