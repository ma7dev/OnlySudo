const { SlashCommandBuilder } = require("@discordjs/builders");

const { makeid } = require("../../utils");
const { postRequest } = require("../../api/server");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("paint")
        .setDescription("Repliddd!")
        .addStringOption((option) => {
            return option
                .setName("caption")
                .setDescription("The user's avatar to show")
                .setRequired(true);
        }),
    async execute(client, interaction) {
        const filename = `${makeid(5)}.jpg`,
            caption = interaction.options.getString("caption");

        const target_url = "/ai/paint",
            target_args = {
                caption,
                filename,
            },
            target_msg = [
                `Processing: ${filename} - style=paint`,
                `Check: ${process.env.BASE_URL}${target_url}/${filename}`,
            ];
        await interaction.deferReply();
        await interaction.editReply({
            content: target_msg[0],
            ephemeral: true,
        });
        postRequest(target_url, target_args, (data) => {
            return interaction.editReply({
                content: target_msg[1],
                ephemeral: true,
            });
        });
    },
};
