const { Listener } = require('@sapphire/framework');                            // Event Listener
const { env } = require('.././config');                                         // env file
const colors = require('colorette');                                            // colors


class VoiceEvent extends Listener {
    
                constructor(context, options) {
                            super(context, { ...options, once: true, event: `ready` }); }   // Get Events Information from https://github.com/KBVE/archive/blob/main/txt/app/discord/discord_events_2022.txt

                
                    async run() {
                               // VoiceEvent Logger
                                this.container.logger.info(
                                    colors.bold(
                                        `${colors.green(` Loading VoiceEvent`)}`
                                    )
                                );
                              

                                try {
                                    await this.container.logger.client.resolveGuildVoiceChannel(env.DISCORD_BOT_TOKEN);
                                    client.logger.info(
                                        colors.bold(colors.green('Successfully logged in...'))
                                    )
                                } catch (error) {
                                    client.logger.fatal(error);
                                    client.destroy();
                                    process.exit(1);
                                }



                                /*
                                const connection = joinVoiceChannel({
                                    channelId: env.DISCORD_VOICE_CHANNEL_ID,
                                    guildId: env.GUILD_ID
                                    //adapterCreator: this.container.client.voice,
                                });
                                */
                                //this.container.client.join("733345228471140445");


                    }

                }


module.exports = {
    VoiceEvent
};


                