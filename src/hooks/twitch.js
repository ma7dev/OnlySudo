require('dotenv').config({path:'../../.env'});

module.exports = {
    getTwitchHook(emitter, twitchBot, discordBot) {
        emitter.on('stream.online',(data) => {
            const event = data.event;
            emitter.emit('server:logging', `**ONLINE**: ${event.broadcaster_user_login}`);
        })
        emitter.on('stream.offline',(data) => {
            const event = data.event
            emitter.emit('server:logging', `**OFFLINE**: ${event.broadcaster_user_login}`);
        })
        emitter.on('channel.raid',(data) => {
            const event = data.event;
            emitter.emit('server:logging', `**RAIDING**: ${event.from_broadcaster_user_login} raided ${event.to_broadcaster_user_login} ${event.viewers} viewers`);
        })
        emitter.on('channel.follow',(data) => {
            // "event": {
            //     "user_id": "1234",
            //     "user_login": "cool_user",
            //     "user_name": "Cool_User",
            //     "broadcaster_user_id": "1337",
            //     "broadcaster_user_login": "cooler_user",
            //     "broadcaster_user_name": "Cooler_User",
            //     "followed_at": "2020-07-15T18:16:11.17106713Z"
            // }
        })
        emitter.on('channel.subscribe',(data) => {
            // channel:read:subscriptions
            // "event": {
            //     "user_id": "1234",
            //     "user_login": "cool_user",
            //     "user_name": "Cool_User",
            //     "broadcaster_user_id": "1337",
            //     "broadcaster_user_login": "cooler_user",
            //     "broadcaster_user_name": "Cooler_User",
            //     "tier": "1000",
            //     "is_gift": false
            // }
        });
        emitter.on("channel.subscription.gift", (data) => {
            // channel:read:subscriptions
            // "event": {
            //     "user_id": "1234",
            //     "user_login": "cool_user",
            //     "user_name": "Cool_User",
            //     "broadcaster_user_id": "1337",
            //     "broadcaster_user_login": "cooler_user",
            //     "broadcaster_user_name": "Cooler_User",
            //     "total": 2,
            //     "tier": "1000",
            //     "cumulative_total": 284, //null if anonymous or not shared by the user
            //     "is_anonymous": false
            // }
        })
        emitter.on("channel.subscription.message", (data) => {
            // channel:read:subscriptions
            // "event": {
            //     "user_id": "1234",
            //     "user_login": "cool_user",
            //     "user_name": "Cool_User",
            //     "broadcaster_user_id": "1337",
            //     "broadcaster_user_login": "cooler_user",
            //     "broadcaster_user_name": "Cooler_User",
            //     "tier": "1000",
            //     "message": {
            //         "text": "Love the stream! FevziGG",
            //         "emotes": [
            //             {
            //                 "begin": 23,
            //                 "end": 30,
            //                 "id": "302976485"
            //             }
            //         ]
            //     },
            //     "cumulative_months": 15,
            //     "streak_months": 1, // null if not shared
            //     "duration_months": 6
            // }
        })
    }
};
