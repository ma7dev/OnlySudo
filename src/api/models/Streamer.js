const mongoose = require("mongoose");

const twitchInfo = {
    twitchName: { type: String, required: true },
    twitchId: { type: String, required: true },
    profileImg: { type: String, default: "" },
};

const twitchStats = {
    streams: { type: Number, default: 0 },
    hosts: { type: Number, default: 0 },
    raids: { type: Number, default: 0 },
    chats: { type: Number, default: 0 },
    views: { type: Number, required: false },
    follows: { type: Number, required: false },
};

const rankInfo = {
    rankName: { type: String, default: "" },
    points: { type: Number, default: 0 },
    activityPoints: { type: Number, default: 0 },
    streamsBeforeDemotion: { type: Number, default: 0 },
};

const invitationInfo = {
    invitedUsers: {
        type: [Number],
        default: [],
    },
    invites: {
        type: Number,
        default: 0,
    },
    eventIds: {
        type: [String],
        default: [],
    },
};

const streamerSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    ...twitchInfo,
    ...twitchStats,
    ...rankInfo,
    ...invitationInfo,
});

// streamerSchema.methods.stream = function stream() {
//     const greeting = this.text
//     ? "Meow name is " + this.text
//     : "I don't have a name";
//     console.log(greeting);
// };

module.exports = {
    Streamer: mongoose.model("Streamers", streamerSchema),
};
