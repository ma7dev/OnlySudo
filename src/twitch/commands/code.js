module.exports = {
    name: "code",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        client.say(channel,
            `https://github.com/sudogroup/onlysudo`
        ).catch(err => console.log(err));
    },
};
