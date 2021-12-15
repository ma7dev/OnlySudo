const { SlashCommandBuilder } = require("@discordjs/builders"),
    wait = require("util").promisify(setTimeout);
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(client, interaction) {
        // await interaction.deferReply();
        // await wait(4000);
        // await interaction.editReply('Pong');
        // await wait(2000);
        // await interaction.editReply('Pong again!');
        // await wait(2000);
        // // await interaction.followUp('???Pong again!');
        // await interaction.deleteReply();
        await interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
    },
};
