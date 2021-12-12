require("dotenv").config({ path: "../../.env" });

const fetch = require("node-fetch");

async function postRequest(client, interaction, url, args, calllbacks) {
    await fetch(`http://localhost:${process.env.PORT}${url}`, {
        method: "POST",
        body: JSON.stringify(args),
        headers: { "Content-Type": "application/json" },
    })
        .then(async (res) => {
            calllbacks(await res.json());
        })
        .catch((error) => {
            calllbacks(error);
        });
}

async function postRequestMore(client, interaction, url, args, msg, calllbacks) {
    await fetch(`http://localhost:${process.env.PORT}${url}`, {
        method: "POST",
        body: JSON.stringify(args),
        headers: { "Content-Type": "application/json" },
    })
        .then(async (res) => {
            console.log(await res.json());
            calllbacks(msg[1]);
        })
        .catch((error) => {
            calllbacks(error);
        });
    calllbacks(msg[0]);
}
module.exports = {
    postRequest,
    postRequestMore,
};
