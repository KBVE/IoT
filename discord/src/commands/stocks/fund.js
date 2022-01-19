//Command / Register Behavior from Sapphire Framework
const { Command, RegisterBehavior } = require('@sapphire/framework');
// Slash Command Builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Stopwatch
const { Stopwatch } = require('@sapphire/stopwatch');
// Message
const { Collection , MessageEmbed } = require('discord.js');


// Glue Code Warning - 
// Most of these commands are only meant for test cases, do not use in production! :)
class FundCommand extends Command {

    //  Constructor - Fund Concept 
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'fund',
            description: 'KBVE Fund Bot',
            preconditions: ['OwnerOnly'],
            chatInputCommand: {
                register: true,
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                guildIds: [process.env.GUILD_ID],
                idHints: ['']
            }
        });
    }

// [0] Async Break down for the chatInputRun
// Check #kbve discord for the new template. 


    async chatInputRun(interaction) {
        //_[START]
        //Init Message
        const embed = new MessageEmbed()
            .setColor(0xfee75c)
            .setDescription(`**Grabbing FUND Data** Please wait...`);

        //_[END] 
        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });



        const type = interaction.options.getSubcommand(true);
        const stock = interaction.options.getString('stock');
        const amount = interaction.options.getString('amount');


        switch (type) {
            case 'buy':
                embed
                .setColor(0x57f287)
                .setDescription(`⏱️ Buying Stock: ${stock}ms\n⌛ Amount: ${amount} kredits`);
                await interaction.editReply({ embeds: [embed] });            
                break; 
            //
            case 'igbc':
                break;
            ///\
            case 'd':
                //_[DEAD] Dead Glue Code from Sapphire, only here for test casing.
                //                          const store = this.container.stores.get(name);
                //                          timer.start();
                //[DEAD]_                          await store.loadAll();
                break;
            default:

                //_[DEAD]
                //timer.start();
                //await Promise.all(
                //    this.container.stores.map(store => store.loadAll())
                //);
                //[DEAD]_
                embed
                .setColor(0x57f287)
                .setDescription(`- No Type -`);
                await interaction.editReply({ embeds: [embed] });
                break;
                
        }



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
                    .setName('buy')
                    .setDescription('Buy Stock')
                    .addStringOption(option =>
                        option
                            .setName('stock')
                            .setDescription('The name of the stock ticker') 
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option
                            .setName('amount')
                            .setDescription('The amount of credits for the ticker') 
                            .setRequired(true)
                    )
            );
          

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [process.env.GUILD_ID]
        });
    }





}



// Export the Final Module

module.exports = {
    FundCommand
};
