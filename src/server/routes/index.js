const express = require('express');

class Router {
    constructor(emitter) {
        this.router = express.Router();
        this.emitter = emitter
        this.router.get('/style', (req, res) => {
            res.render('style');
        })
        this.router.get('/', (req, res) => {
            res.send('Hello World!')
        })
    }
}

module.exports = { path: "/", Router };
