const { MessageEmbed } = require('discord.js');
const { Command, RegisterBehavior } = require('@sapphire/framework');
// Slash Command Builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Python Script Integration
const { spawn } = require('child_process');

class LightsCommand extends Command {

    // Constructor for the command.
    // START [Constructor]
    // information: "lights" {Name of the command}
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
    // END [Constructor]

    async chatInputRun(interaction) {
        const embed = new MessageEmbed()
            .setColor(0xfee75c)
            .setDescription('**Processing Lights.py** Please wait...')

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        var reg=/^#([0-9a-f]{3}){1,2}$/i;
        const type = interaction.options.getSubcommand(true);
        const hex = interaction.options.getString('hex');

        if(!reg.test(hex))
        {
            embed
            .setColor(0xff0000)
            .setDescription(`Not a valid Hex Code`);

            await interaction.editReply({ embeds: [embed] });
        }
        else{
            // Test if hex passes through. We want to make sure that we check the safety of the string as well.
            // Sanitizing the string again, just to ensure that we are operating at a safe level. 
            console.log(hex);
            const ping = interaction.client.ws.ping;
            const latency = Date.now() - message.createdTimestamp;
            
            const pyProg = spawn('python', ['./../home/lights/wiz/_lights.py', hex]);

            pyProg.stdout.on('data', function(data) {
        
                console.log(data.toString());
                res.write(data);
                res.end('end');
            });
            
            embed
                .setColor(0x57f287)
                .setDescription(`💡 Light Color: ${hex}\n⌛ Latency: ${latency}ms`);

            await interaction.editReply({ embeds: [embed] });
        }
    }

    // Auto Complete Function

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
                    .setDescription('Hex Color of the Lights')
                    .addStringOption(option =>
                        option
                            .setName('hex')
                            .setDescription('The name of the hex color to use') 
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
