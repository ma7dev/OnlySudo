require("dotenv").config({ path: "../../.env" });

const axios = require("axios");

function postRequest(client, channel, url, args) {
    axios
        .post(`http://localhost:${process.env.PORT}${url}`, args)
        .then((res) => {
            client.say(channel, res.data);
        })
        .catch((error) => {
            console.error(error);
        });
}

function postRequestMore(client, channel, url, args, msg) {
    axios
        .post(`http://localhost:${process.env.PORT}${url}`, args)
        .then((res) => {
            client.say(channel, msg[1]);
        })
        .catch((error) => {
            console.error(error);
        });
    client.say(channel, msg[0]);
}
module.exports = {
    postRequest,
    postRequestMore,
};
