require('dotenv').config({path:'../../../env'});

module.exports = {
    name: "link",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        client.say(
            channel,
            process.env.BASE_URL
        );
    },
};
