//Command / Register Behavior from Sapphire Framework
const { Command, RegisterBehavior } = require('@sapphire/framework');
// Slash Command Builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Stopwatch
const { Stopwatch } = require('@sapphire/stopwatch');
// Message
const { Collection , MessageEmbed } = require('discord.js');



class BuyCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'buy',
            description: 'Buy a certain stock!',
            preconditions: ['OwnerOnly'],
            chatInputCommand: {
                register: true,
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                guildIds: [process.env.GUILD_ID],
                idHints: ['']
            }
        });
    }

// TBD

    async chatInputRun(interaction) {

        //const type = interaction.options.getSubcommand(true);
        const stock = interaction.options.getString('stock');
        const amount = interaction.options.getString('amount');
        const embed = new MessageEmbed()
            .setColor(0xfee75c)
            .setDescription(`**Buying ${amount} of ${stock}** Please wait...`);

        await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });
        embed
            .setColor(0x57f287)
            .setDescription(`⏱️ Type: ${stock}ms\n⌛ Latency: ${name}ms`);

        await interaction.editReply({ embeds: [embed] });
    }


}



// Export the Final Module

module.exports = {
    BuyCommand
};
