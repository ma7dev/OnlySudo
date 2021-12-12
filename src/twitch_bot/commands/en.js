const { postRequest } = require("../utils/request");

module.exports = {
    name: "en",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const message = args.join(" ");

        const target_url = "/ai/en",
            target_args = {
                message,
            };
        postRequest(client, channel, target_url, target_args);
    },
};
