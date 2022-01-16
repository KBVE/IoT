const { MessageEmbed } = require('discord.js');
const { Command, RegisterBehavior } = require('@sapphire/framework');

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
            .setDescription('**Processing Lights.py** Please wait...');

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });
        let light_color = interaction.options.get("color");
        console.log(light_color);
        const ping = interaction.client.ws.ping;
        const latency = Date.now() - message.createdTimestamp;

        embed
            .setColor(0x57f287)
            .setDescription(`⏱️ Light Color: ${light_color}ms\n⌛ Latency: ${latency}ms`);

        await interaction.editReply({ embeds: [embed] });
    }
}

module.exports = {
    LightsCommand
};
