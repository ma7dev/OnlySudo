module.exports = {
    name: "hi",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        client.say(
            channel,
            `Hi @${channel.replace("#", "")}, ` +
                `@${context.username} brought me here! I'm a bot and I am alive!!`
        );
    },
};
