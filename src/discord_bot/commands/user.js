const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Display info about yourself.'),
	async execute(client, interaction) {
		return interaction.reply(
            `Your username: ` + 
            `${interaction.user.username}\n` + 
            `Your ID: ${interaction.user.id}`
        );
	},
};