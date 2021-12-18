require('dotenv').config({path:'../../.env'});

const { postRequest } = require('../../api/server'); 

module.exports = {
    name: "tts",
    description: "Ping!",
    async execute(client, channel, context, msg, args) {
        const streamer = channel.replace("#", ""),
            filename = `${streamer}.wav`,
            message = args.join(" ");
        console.log(`${streamer} ${filename}`);
        const target_url = "/ai/tts",
            target_args = {
                message,
                filename,
            },
            target_msg = 
            `Check: ${process.env.BASE_URL}${target_url}/${filename}`;
        
        postRequest(target_url, target_args, (data) => {
            client.emitter.emit('tts', {streamer, path: `${process.env.PROJECT_PATH}/src/server/public${target_url}/${filename}`,url: `${process.env.BASE_URL}${target_url}/${filename}` });
            // return client.say(channel, target_msg).catch(err => console.log(err));
        });
    },
};
