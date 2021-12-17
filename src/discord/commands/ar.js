const { SlashCommandBuilder } = require("@discordjs/builders");

const { postRequest } = require("../../api/server");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ar")
        .setDescription("Repliddd!")
        .addStringOption((option) => {
            return option
                .setName("message")
                .setDescription("The user's avatar to show")
                .setRequired(true);
        }),
    async execute(client, interaction) {
        const message = interaction.options.getString("message");
        const target_url = "/ai/ar",
            target_args = {
                message,
            };
        await interaction.deferReply();
        postRequest(target_url, target_args, (data) => {
            return interaction.editReply({
                content: data,
                ephemeral: true,
            });
        });
    },
};
