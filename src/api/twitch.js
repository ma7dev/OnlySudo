require('dotenv').config({path:'../../.env'});

const axios = require('axios');

const URL = `https://api.twitch.tv/helix`;

function getRequestTwitch(url, cb) {
    axios.get(`${URL}${url}`, {
        headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            "Authorization": `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
        }
    })
    .then(async res => {
        cb(await res.data)
    }).catch(err => console.log(err))
}

module.exports = {
    getFollowers(twitchId, cb) {
        getRequestTwitch(`/users?from_id=${twitchId}&first=1`, (data) => {
            if(cb) cb(data.total);
        })
    },
    getUser(twitchName, cb) {
        getRequestTwitch(`/users?login=${twitchName}`, (data) => {
            if(cb) {
                if (data.data.length === 0) {
                    return cb(null);
                }
                cb(data.data[0])
            }
        })
    },
    // clips - https://dev.twitch.tv/docs/api/reference#get-clips
    // game_id, game_name, type (live), title, viewer_count, start_at, is_mature 
    getStreams(twitchId, cb) {
        console.log(twitchId)
        getRequestTwitch(`/streams?user_id=${twitchId}&first=1`, (data) => {
            if(cb) cb(data.data[0]);
        })
    }
}