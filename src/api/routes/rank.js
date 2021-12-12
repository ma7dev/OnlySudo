const express = require('express'),
    router = express.Router();

const { Rank } = require("../models/Rank");

router.post('/', async (req, res) => {
    const rank = new Rank({ text: req.body.text });
    await rank.save();

    // rank.stream()
    
    res.send({rank})
})

router.put('/:rankId', async (req, res) => {
    const rankId = req.params.rankId;
    const text = req.body.text;
    
    const rank = await Rank.findByIdAndUpdate({ _id: rankId }, { text });

    res.json({rank})
})

router.delete('/:rankId', async (req, res) => {
    const rankId = req.params.rankId;
    
    const rank = await Rank.deleteOne({ _id: rankId });

    res.json({rank})
})

router.get('/:rankId', async (req, res) => {
    const rankId = req.params.rankId;
    const rank = await Rank.find({ _id: rankId });

    res.json({ rank })
})

router.get('/', async (req, res) => {
    const ranks = await Rank.find();

    res.json({ ranks })
})

module.exports = router;
