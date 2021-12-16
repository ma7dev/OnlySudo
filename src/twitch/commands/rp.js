module.exports = {
    name: "rp",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        let message = [];
        for(let i=0; i<10; i++) {
            message.push(args);
        }
        client.say(
            channel,
            `${message.join(" ")}`
        ).catch(err => console.log(err));
    },
};
