const mongoose = require('mongoose');

const rankSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roleId: { type: String, required: true },
    channelId: { type: String, required: true },
    threshold: { type: Number, required: true }
});

// streamerSchema.methods.stream = function stream() {
//     const greeting = this.text
//     ? "Meow name is " + this.text
//     : "I don't have a name";
//     console.log(greeting);
// };

module.exports = { 
    Rank: mongoose.model('Ranks', rankSchema) 
}
