require('dotenv').config({path: `../../.env`});
const { SlashCommandBuilder } = require('@discordjs/builders');

// Turn bot off (destroy), then turn it back on
function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send('Resetting...')
    .then(msg => client.destroy())
    .then(() => client.login(process.env.DISCORD_BOT_TOKEN));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Replies with Pong!'),
	async execute(client, interaction) {
        resetBot(interaction.channel);
	},
};