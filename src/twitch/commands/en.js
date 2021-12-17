const { postRequest } = require("../../api/server");

module.exports = {
    name: "en",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const message = args.join(" ");

        const target_url = "/ai/en",
            target_args = {
                message,
            };
        postRequest(target_url, target_args, (data) => {
            return client.say(channel,data).catch(err => console.log(err));
        });
    },
};
