require("dotenv").config({ path: "../../.env" });
const fs = require("fs"),
    { REST } = require("@discordjs/rest"),
    { Routes } = require("discord-api-types/v9");

const clientId = process.env.DISCORD_CLIENT_ID,
    guildId = process.env.DISCORD_GUILD_ID;

const commands = [];
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            // Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
