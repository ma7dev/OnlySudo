const { SlashCommandBuilder } = require("@discordjs/builders");

const { makeid } = require("../utils");
const { postRequest } = require("../../api/server");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("arcane")
        .setDescription("Repliddd!")
        .addSubcommand(subcommand =>
            subcommand
                .setName('streamer')
                .setDescription('Info about a user')
                .addStringOption((option) => {
                    return option
                        .setName("input")
                        .setDescription("The user's avatar to show")
                        .setRequired(true);
                })
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('url')
                .setDescription('Info about the server')
                .addStringOption((option) => {
                    return option
                        .setName("input")
                        .setDescription("The user's avatar to show")
                        .setRequired(true);
                })
        ),
    async execute(client, interaction) {
        const filename = `${makeid(5)}.jpg`;
        let url = interaction.options.getString("input");
        console.log(interaction.options.getSubcommand())
        if (interaction.options.getSubcommand() === 'streamer') {
            url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${url}.jpg`;
        }

        const target_url = "/ai/arcane",
            target_args = {
                url,
                filename,
            },
            target_msg = [
                `Processing: ${filename} - style=arcane`,
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
