const express = require('express');

class Router {
    constructor(emitter) {
        this.router = express.Router();
        this.emitter = emitter
        this.router.get('/chat', (req, res) => {
            res.render('chat');
        })
        this.router.get('/tts/:username', (req, res) => {
            res.render('tts', { username: req.params.username });
        })
        this.router.get('/style', (req, res) => {
            res.render('style');
        })
        this.router.get('/', (req, res) => {
            res.send('Hello World!')
        })
    }
}

module.exports = { path: "/", Router };
