//Command / Register Behavior from Sapphire Framework
const { Command, RegisterBehavior } = require('@sapphire/framework');
// Slash Command Builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Stopwatch
const { Stopwatch } = require('@sapphire/stopwatch');
// Message
const { Collection , MessageEmbed } = require('discord.js');



class FundCommand extends Command {
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



    async chatInputRun(interaction) {

        const type = interaction.options.getSubcommand(true);
        const stock = interaction.options.getString('stock');
        const amount = interaction.options.getString('amount');
        const embed = new MessageEmbed()
            .setColor(0xfee75c)
            .setDescription(`**Buying ${amount} of ${stock}** Please wait...`);

        await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        switch (type) {
            case 'piece':
                const pieces = new Collection().concat(
                    ...this.container.stores.values()
                );
                const piece = pieces.get(name);
                timer.start();
                await piece.reload();
                break;
            case 'store':
                const store = this.container.stores.get(name);
                timer.start();
                await store.loadAll();
                break;
            default:
                timer.start();
                await Promise.all(
                    this.container.stores.map(store => store.loadAll())
                );
        }



        embed
            .setColor(0x57f287)
            .setDescription(`⏱️ Type: ${stock}ms\n⌛ Latency: ${name}ms`);

        await interaction.editReply({ embeds: [embed] });
    }


}



// Export the Final Module

module.exports = {
    FundCommand
};
