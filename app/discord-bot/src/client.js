const { GatewayIntentBits } = require('discord-api-types/v9');
const { SapphireClient } = require('@sapphire/framework');
const { Constants } = require('discord.js');
const { env } = require('./config');
const colors = require('colorette');



const logClientIn = async () => {
    const client = new SapphireClient({
        enableLoaderTraceLoggings: true,
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates],
        partials: [Constants.PartialTypes.CHANNEL],
        disableMentions: 'everyone'
    });

    try {
            await client.login(env.DISCORD_BOT_TOKEN);  client.logger.info(colors.bold(colors.green('Successfully logged in...')));  
        }       catch (error) {       client.logger.fatal(error);         client.destroy();       process.exit(1);    }
};

module.exports = {
    logClientIn
};
