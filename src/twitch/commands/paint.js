require("dotenv").config({ path: "../../../.env" });

const { makeid } = require("../../utils");
const { postRequest } = require("../../api/server");

module.exports = {
    name: "paint",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const filename = `${makeid(5)}.jpg`,
            caption = args.join(" ");

        const target_url = "/ai/paint",
            target_args = {
                caption,
                filename,
            },
            target_msg = [
                `Processing: ${filename} - style=paint`,
                `Check: ${process.env.BASE_URL}${target_url}/${filename}`,
            ];
        await client.say(channel, target_msg[0]).catch(err => console.log(err))
        postRequest(target_url, target_args, (data) => {
            return client.say(channel, target_msg[1]).catch(err => console.log(err));
        });
    },
};
