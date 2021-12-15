const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("")
        .setDescription("")
        .addUserOption((option) => {
            return option.setName("").setDescription("");
        }),
    async execute(interaction) {},
};
