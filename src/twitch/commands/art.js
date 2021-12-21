require("dotenv").config({ path: "../../../.env" });

const { makeid, getRandomInt } = require("../../utils");
const { postRequest } = require("../../api/server");

module.exports = {
    name: "art",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const filename = `${makeid(5)}.jpg`,
            streamer = channel.replace("#", "");

        let style_selected = getRandomInt(30);

        let url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}.jpg`;
        if (args.length > 0) {
            if (args[0].includes("http://") || args[0].includes("https://")) {
                url = args[0];
            } else {
                url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${args[0]}.jpg`;
            }
        }
        if (args.length > 1) {
            style_selected = args[1];
        }

        const target_url = "/ai/style_transfer",
            target_args = {
                url,
                style_selected,
                filename,
            },
            target_msg = [
                `Processing: ${filename} - style=${style_selected}`,
                `Check: ${process.env.BASE_URL}${target_url}/${filename}`,
            ];
        await client.say(channel, target_msg[0]).catch(err => console.log(err))
        postRequest(target_url, target_args, (data) => {
            return client.say(channel, target_msg[1]).catch(err => console.log(err));
        });
    },
};
