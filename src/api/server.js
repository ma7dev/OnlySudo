require('dotenv').config({path:'../../.env'});

const axios = require('axios');

const URL = `http://localhost:${process.env.PORT}`;

module.exports = {
    postRequest(client, channel, url, args) {
        axios
            .post(`${URL}${url}`, args)
            .then((res) => {
                client.say(channel, res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    },
    postRequestMore(client, channel, url, args, msg) {
        axios
            .post(`${URL}${url}`, args)
            .then((res) => {
                client.say(channel, msg[1]);
            })
            .catch((error) => {
                console.error(error);
            });
        client.say(channel, msg[0]);
    }
}