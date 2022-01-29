const { Listener } = require('@sapphire/framework');                            // Event Listener
const Filter = require('bad-words');                                            // Filter 
const { env } = require('.././config');                                         // env file
const axios = require('axios');                                             // Axios HTTP
const tmi = require('tmi.js');                                                                      //  TMI.js
const Koa = require('koa');                                                                         //  Koa
const router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

class TwitchEvent extends Listener {
    constructor(context, options) {
        super(context, { ...options, once: true, event: `ready` });
    }

    async _valid(vr_message)    { let clean_message;    try {   clean_message = new Filter().clean((vr_message));  } catch (error) {  console.log(error) }     return clean_message;   }

    async _post(url,data) {     let resp;   try {   resp = await axios.post(url,data);  } catch (err) {     return Promise.reject(err);   }     return resp;    };

    async run() {
        
        const twitchClient = new tmi.Client({   options: { debug: true },   connection: { reconnect: true, secure: true },  identity: { username: env.TWITCH_USERNAME, password: env.TWITCH_BOT_TOKEN },    channels: [env.TWITCH_CHANNEL]  });

        try {   await twitchClient.connect();     } catch (error) {   console.log(error); }    // Boot up Twitch , which will be connect and on connected
        try {   twitchClient.on('connected', () =>{   console.log('Twitch started.'); });   } catch (error) {   console.log(error); }

        // Upon the connection, start Express   const app = express();          const router = express.Router();        app.use(bodyParser.urlencoded({ extended: true }));     app.use(bodyParser.json()); router.get('/twitch_api', function(req, res) {  res.json({ message: 'hooray! welcome to our api!' });   }); app.use('/api', router); app.listen(twitch_port);
        
        
        twitchClient.on('message', async (channel, user, message, self) => {
            if(!self) {
            //message = this._valid(message);
            let _m; try { _m = await this._valid(message);  }   catch (error)   {  console.log(error) }
            
            let _j_Object = {
                username: `[Twitch] ${user.username}`,
                avatar_url: ``,
                content: _m,
            };

            this._post(env.TWITCH_DISCORD_WEBHOOK,_j_Object);
        }
        });

        const app = new Koa();     let app_router = new router();   app.use(bodyParser());
        
        app_router.post('/api/twitch_api', (ctx, next) => {   
            ctx.body = ctx.request.body;    twitchClient.say(env.TWITCH_CHANNEL, `[Discord@${ctx.body.username}] ${ctx.body.message}`);   
        });
        app.use(app_router.routes()).use(app_router.allowedMethods());
        const http_app = app.listen(env.TWITCH_HTTP_API_PORT,   ()  =>  {           console.log(`Twitch API Server listening on port: ${env.TWITCH_HTTP_API_PORT}`);        });
        }
}

module.exports = {
    TwitchEvent
};
