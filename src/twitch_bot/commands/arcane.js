require("dotenv").config({ path: "../../../.env" });

const { makeid } = require("../utils/utils");
const { postRequestMore } = require("../utils/request");

module.exports = {
    name: "arcane",
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

        const target_url = "/ai/arcane",
            target_args = {
                url,
                filename,
            },
            target_msg = [
                `Processing: ${filename} - style=arcane`,
                `Check: ${process.env.BASE_URL}${target_url}/${filename}`,
            ];
        postRequestMore(client, channel, target_url, target_args, target_msg);
    },
};
