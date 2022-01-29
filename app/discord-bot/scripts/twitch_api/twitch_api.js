require('dotenv').config({ path: '../../.env' }); // Configuration for the environmental variables.
//require('@sapphire/plugin-logger/register');  Plugin Ready State Removed. Will add it back it once everything is running smoothly.
const tmi = require('tmi.js');                                                                      //  TMI.js
const axiso = require('axios');                                                                     //  Axios
const { env } = require('../../src/./config');                                                      //  env Config
const Koa = require('koa');                                                                         //  Koa
const router = require('koa-router');
const bodyParser = require('koa-body');

//const express = require('express');   Replacing Express with Koa.
//const bodyParser = require('body-parser');


const twitch_port = env.TWITCH_HTTP_API_PORT;


const twitch_api = async () => {
    
    const twitchClient = new tmi.Client({
            options: { debug: true },
            connection: { reconnect: true, secure: true },
            identity: { username: env.TWITCH_USERNAME, password: env.TWITCH_BOT_TOKEN },
            channels: [env.TWITCH_CHANNEL]
        });

    // Boot up Twitch , which will be connect and on connected
        
    try {
        
        await twitchClient.connect();  
    
        } catch (error) {   console.log(error); }

    try {

        twitchClient.on('connected', () =>{   console.log('Twitch started.'); });
        
        } catch (error) {   console.log(error); }

    // Upon the connection, start Express
    /*
    const app = express();
    const router = express.Router();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    router.get('/twitch_api', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });
    
    app.use('/api', router)

    app.listen(twitch_port)
    */

    const app = new Koa().listen(this.twitch_port);




}

twitch_api();

/*
module.exports = {
    twitch_api
};*/



