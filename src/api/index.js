const express = require('express'),
    mongoose = require('mongoose'),
    ejs = require('ejs');

const router = require("./routes/index"),
    streamer_router = require("./routes/streamer"),
    rank_router = require("./routes/rank"),
    validate_router = require("./routes/validate"),
    ai_router = require("./routes/ai");

require('dotenv').config({path:'../../.env'});

const app = express(),
    port = process.env.PORT || 4000;

app.use(express.json())
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
app.set('view engine', 'ejs');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tlsCAFile: "../../ca-certificate.crt"
    }).catch(err => {
        console.error(err.stack)
        process.exit(1)
    });
}

app.use('/streamer', streamer_router)
app.use('/rank', rank_router)
app.use('/validate', validate_router)
app.use('/ai', ai_router)
app.use('/', router)


app.listen(port, () => {
    console.log(`localhost:${port}`)
});