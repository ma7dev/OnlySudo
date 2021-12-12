const express = require("express"),
    router = express.Router();

router.get("/style", (req, res) => {
    res.render("style");
});
router.post("/", (req, res) => {
    console.log(JSON.stringify("Hello World!"));
    res.send(JSON.stringify("Hello World!"));
});
router.get("/", (req, res) => {
    res.send(JSON.stringify("Hello World!"));
});

module.exports = router;
