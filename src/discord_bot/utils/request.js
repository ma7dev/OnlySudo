require("dotenv").config({ path: "../../.env" });

const fetch = require("node-fetch");

async function postRequest(client, interaction, url, args, calllbacks) {
    console.log(`http://localhost:${process.env.PORT}${url}`);
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

function postRequestMore(client, interaction, url, args, msg, calllbacks) {
    axios
        .post(`http://localhost:${process.env.PORT}${url}`, args)
        .then((res) => {
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
