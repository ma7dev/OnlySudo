require('dotenv').config({path:'../../.env'});

const { SlashCommandBuilder } = require("@discordjs/builders"),
    { VoiceConnectionStatus, entersState, getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

const { postRequest } = require("../../api/server");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tts")
        .setDescription("Repliddd!")
        .addStringOption((option) => {
            return option
                .setName("message")
                .setDescription("The user's avatar to show")
                .setRequired(true);
        }),
    async execute(client, interaction) {
        const streamer = 'discord',
            filename = `${streamer}.wav`,
            message = interaction.options.getString("message"),
            guild = await client.guilds.fetch("696537024143818773");
        
        const target_url = "/ai/tts",
            target_args = {
                message,
                filename,
            };
        let connection = joinVoiceChannel({
            channelId: "698375496768946226",
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false // this may also be needed
        });
        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('The connection has entered the Ready state - ready to play audio!');
        });
        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
                // Seems to be reconnecting to a new channel - ignore disconnect
            } catch (error) {
                // Seems to be a real disconnect which SHOULDN'T be recovered from
                connection.destroy();
            }
        });
        postRequest(target_url, target_args, (data) => {
            const player = createAudioPlayer();
            player.stop();
            const resource = createAudioResource(`${process.env.PROJECT_PATH}/src/server/public/ai/tts/${filename}`);
            resource.volume = 1;
            player.play(resource);
            const subscription = connection.subscribe(player);
            if (subscription) {
                // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
                setTimeout(() => subscription.unsubscribe(), 5_000);
            }
            player.on(AudioPlayerStatus.Playing, () => {
                console.log('The audio player has started playing!');
            });
            player.on('error', error => {
                console.error(error);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });
        });
    },
};
