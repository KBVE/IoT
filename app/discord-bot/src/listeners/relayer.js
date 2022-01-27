const { Listener } = require('@sapphire/framework');                            // Event Listener
const Filter = require('bad-words');                                            // Filter 
const tmi = require('tmi.js');                                                  // TMI
const { env } = require('../.././config');                                      // env file

class RelayerEvent extends Listener {
    
    constructor(context, options) {
        super(context, { ...options, event: `messageCreate` }); }   // Get Events Information from https://github.com/KBVE/archive/blob/main/txt/app/discord/discord_events_2022.txt

    async _valid(vr_message)    { let clean_message;    try {   clean_message = new Filter().clean((vr_message));  } catch (error) {  console.log(error) }     return clean_message;   }

    async _twitch(vr_author, vr_message)   {  
 
        const twitch_client = new tmi.Client({
                options: { debug: true, messagesLogLevel: "info" },
                connection: {
                    reconnect: true,
                    secure: true
                },
                identity: {
                    username: 'kbve',
                    password: env.TWITCH_BOT_TOKEN
                },
                channels: [ 'kbve' ]
            });
            twitch_client.connect().catch(console.error);
            twitch_client.say(channel,`[Discord@${vr_author}] ${vr_message}`);
            

    }       

    async run(message) {
        if(!message.author.id)                              {                                   return;     }   //  Null Check
        if(this.container.client.id == message.author.id)   {                                   return;     }   //  Ignore Messages from the bot.
        if(message.webhookId)                               {       console.log(message);       return;     }   //  Ignore Webhooks
        if(!message.content)                                {                                   return;     }   //  Empty Content Message
        
        
        // Currently structuring the listener


            let _a = message.author.id;
            let _m; try { _m = await this._valid(message.content); } catch (error) {  console.log(error) }
            this._twitch(_a,_m);
            
           

            console.log(_m);
            console.log(_a);

        // Twitch Relay

    }
}

module.exports = {
    RelayerEvent
};
