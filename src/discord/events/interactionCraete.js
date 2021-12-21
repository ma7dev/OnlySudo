module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        if (interaction.user.id != "263980320926334976") return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
