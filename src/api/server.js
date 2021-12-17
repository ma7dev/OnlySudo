require('dotenv').config({path:'../../.env'});

const axios = require('axios');

const URL = `http://localhost:${process.env.PORT}`;

module.exports = {
    postRequest(url, args, cb) {
        console.log('postRequest')
        axios.post(`${URL}${url}`, args)
        .then(async res => {
            cb(await res.data);
        }).catch(err => console.log(err))
    },
}