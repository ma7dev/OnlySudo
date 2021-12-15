module.exports = {
    name: "ping",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        client.say(
            channel,
            "Pong."
        ).catch(err => console.log(err));
    },
};
