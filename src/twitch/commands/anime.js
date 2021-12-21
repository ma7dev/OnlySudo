require("dotenv").config({ path: "../../../.env" });

const { makeid } = require("../../utils");
const { postRequest } = require("../../api/server");

module.exports = {
    name: "anime",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const filename = `${makeid(5)}.jpg`,
            streamer = channel.replace("#", "");
        let url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}.jpg`;
        if (args.length != 0) {
            if (args[0].includes("http://") || args[0].includes("https://")) {
                url = args[0];
            } else {
                url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${args[0]}.jpg`;
            }
        }

        const target_url = "/ai/anime",
            target_args = {
                url,
                filename,
            },
            target_msg = [
                `Processing: ${filename} - style=anime`,
                `Check: ${process.env.BASE_URL}${target_url}/${filename}`,
            ];
        await client.say(channel, target_msg[0]).catch(err => console.log(err))
        postRequest(target_url, target_args, (data) => {
            return client.say(channel, target_msg[1]).catch(err => console.log(err));
        });
    },
};
