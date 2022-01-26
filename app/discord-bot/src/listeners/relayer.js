const { Listener } = require('@sapphire/framework');

class RelayerEvent extends Listener {
    constructor(context, options) {
        super(context, { ...options, 
                          event: `messageCreate` // Get Events Information from https://github.com/KBVE/archive/blob/main/txt/app/discord/discord_events_2022.txt
                    });}

    async run(message) {
        if(this.container.client.id == message.author.id) {     console.log('Self Message ?| Ignoring');    return;     }   //  Ignore Messages from the bot.
        if(message.webhookId)                             {     console.log('Webhook? Going to ignore');    return;     }   //  Ignore Webhooks
        
        // Currently structuring the listener
            console.log('Grabbing');
            console.log(message.content);
            console.log(message);
              
    }
}

module.exports = {
    RelayerEvent
};
