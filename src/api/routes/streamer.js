const express = require("express"),
    router = express.Router();

const { Streamer } = require("../models/Streamer");

router.post("/", async (req, res) => {
    const streamer = new Streamer({ text: req.body.text });
    await streamer.save();
    streamer.stream();

    res.send({ streamer });
});

router.put("/:streamerId", async (req, res) => {
    const streamerId = req.params.streamerId;
    const text = req.body.text;

    const streamer = await Streamer.findByIdAndUpdate(
        { _id: streamerId },
        { text }
    );

    res.json({ streamer });
});

router.delete("/:streamerId", async (req, res) => {
    const streamerId = req.params.streamerId;

    const streamer = await Streamer.deleteOne({ _id: streamerId });

    res.json({ streamer });
});

router.get("/:streamerId", async (req, res) => {
    const streamerId = req.params.streamerId;
    const streamer = await Streamer.find({ _id: streamerId });
    res.json({ streamer });
});

router.get("/", async (req, res) => {
    const streamers = await Streamer.find();
    res.json({ streamers });
});

module.exports = router;
