const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("dd")
        .addUserOption((option) => {
            return option
                .setName("username")
                .setRequired(true)
                .setDescription("The username of the user to register");
        }),
    async execute(client, interaction) {
        const role = interaction.options.getRole("streamer");
        const member = interaction.options.getMember("target");
        member.roles.add(role);
    },
};
