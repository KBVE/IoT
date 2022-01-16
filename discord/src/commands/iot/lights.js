const { MessageEmbed } = require('discord.js');
const { Command, RegisterBehavior } = require('@sapphire/framework');
// Slash Command Builder
const { SlashCommandBuilder } = require('@discordjs/builders');

class LightsCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'lights',
            description: 'Control the Lights within the home',
            chatInputCommand: {
                register: true,
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                guildIds: [process.env.GUILD_ID],
                idHints: ['']
            }
        });
    }

    async chatInputRun(interaction) {
        const embed = new MessageEmbed()
            .setColor(0xfee75c)
            .setDescription('**Processing Lights.py** Please wait...')

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        
        const type = interaction.options.getSubcommand(true);
        const name = interaction.options.getString('hex');
        console.log(light_color);
        const ping = interaction.client.ws.ping;
        const latency = Date.now() - message.createdTimestamp;

        embed
            .setColor(0x57f287)
            .setDescription(`⏱️ Light Color: ${light_color}ms\n⌛ Latency: ${latency}ms`);

        await interaction.editReply({ embeds: [embed] });
    }

    autocompleteRun(interaction) {
        const type = interaction.options.getSubcommand(true);
        const query = interaction.options.getFocused();

        const options =
            type === 'piece'
                ? new Collection()
                      .concat(...this.container.stores.values())
                      .filter(
                          piece => !piece.location.full.includes('node_modules')
                      )
                : this.container.stores;

        return interaction.respond(
            [...options.values()]
                .map(piece => ({
                    name: piece.name,
                    value: piece.name
                }))
                .filter(option => !query.trim() || option.name.includes(query))
        );
    }

    
    registerApplicationCommands(registry) {
        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('hex')
                    .setDescription('Reload a piece of code')
                    .addStringOption(option =>
                        option
                            .setName('hex')
                            .setDescription('The name of the piece to reload')
                            .setRequired(true)
                    )
            );
          

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [process.env.GUILD_ID]
        });
    }



}

module.exports = {
    LightsCommand
};
