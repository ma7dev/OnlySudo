require("dotenv").config({ path: "../../../.env" });

const { makeid, getRandomInt } = require("../utils/utils");
const { postRequestMore } = require("../utils/request");

module.exports = {
    name: "pixel",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const filename = `${makeid(5)}.jpg`,
            streamer = channel.replace("#", "");

        let palette = 8;

        let url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}.jpg`;
        if (args.length > 0) {
            if (args[0].includes("http://") || args[0].includes("https://")) {
                url = args[0];
            } else {
                url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${args[0]}.jpg`;
            }
        }
        if (args.length > 1) {
            palette = args[1];
        }

        const target_url = "/ai/pixel",
            target_args = {
                url,
                palette,
                filename,
            },
            target_msg = [
                `Processing: ${filename} - palette=${palette}`,
                `Check: ${process.env.BASE_URL}${target_url}/${filename}`,
            ];
        postRequestMore(client, channel, target_url, target_args, target_msg);
    },
};
