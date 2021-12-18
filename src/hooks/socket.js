require('dotenv').config({path:'../../.env'});

const fs = require('fs');

const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    getSocketHook(io, emitter, twitchBot, discordBot) {
        io.on('connection', (socket) => {
            socket.broadcast.emit('hi');
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
            emitter.on('tts', async (data) => {  
                console.log(`tts:${data.streamer}`)
                console.log(data.url)
                while (!fs.existsSync(`${data.path}`)) {
                    console.log(`waiting for ${data.path}`);
                    await delay(1000);
                }
                socket.emit(`tts:${data.streamer}`, data.url);
            })
        });
        
    }
};
