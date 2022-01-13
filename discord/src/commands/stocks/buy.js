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



    async chatInputRun(interaction) {

        const type = interaction.options.getSubcommand(true);
        const name = interaction.options.getString('name');

        const embed = new MessageEmbed()
            .setColor(0xfee75c)
            .setDescription('**Buying?** Please wait...');

        await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });
        embed
            .setColor(0x57f287)
            .setDescription(`⏱️ Type: ${type}ms\n⌛ Latency: ${name}ms`);

        await interaction.editReply({ embeds: [embed] });
    }


}



// Export the Final Module

module.exports = {
    BuyCommand
};
