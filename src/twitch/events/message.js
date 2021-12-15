require("dotenv").config({ path: "../../.env" });

module.exports = {
    name: "message",
    execute(client, channel, context, msg) {
        if (
            !msg.startsWith(process.env.PREFIX) ||
            context.username.toLowerCase() ===
                process.env.TWITCH_BOT_USERNAME.toLowerCase()
        )
            return;
        console.log(context.username);
        if (context.username != "sudomaze") return;
        // pre-process the command
        const args = msg.substring(process.env.PREFIX.length).split(/ +/), // remove process.env.PREFIX and split the argument has multiple arguments
            commandName = args.shift().toLowerCase(); // get command and turn it to lowercase

        console.log(args);
        console.log(commandName);

        // commands
        // check for aliases
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );
        if (!command) return;

        // check if the command requires arguments
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${context.username}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
            }

            return client.say(channel, reply);
        }

        // execute
        try {
            command.execute(client, channel, context, msg, args);
        } catch (error) {
            console.error(error);
            client.say(
                channel,
                "there was an error trying to execute that command!"
            );
        }
    },
};
