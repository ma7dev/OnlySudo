require('dotenv').config({path:'../../../env'});

module.exports = {
    name: "sc",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const streamer = channel.replace("#", "");
        let url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}.jpg`;
        if (args.length != 0) {
            if (args[0].includes("http://") || args[0].includes("https://")) {
                url = args[0];
            } else {
                url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${args[0]}.jpg`;
            }
        }
        client.say(
            channel,
            url
        );
    },
};
