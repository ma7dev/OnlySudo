module.exports = {
    name: "bye",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        client.say(channel, `Bye chat!`);
    },
};
