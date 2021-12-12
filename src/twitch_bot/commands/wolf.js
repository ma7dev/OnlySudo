const { postRequest } = require('../utils/request');

module.exports = {
    name: "wolf",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const message = args.join(' ');

        const target_url = '/ai/wolf',
            target_args = {
                message
            }
        postRequest(client, channel, target_url, target_args)
    },
};
