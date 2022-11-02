const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('author')
		.setDescription('✨ About author embed message!'),
	async execute(interaction) {
        const authorEmbed = new EmbedBuilder()
            .setTitle('Author information')
            .setColor(0x06D6A0)
            .setDescription('Here you can found some information about the author ✨')
            .addFields(
                { name: 'Who I am ?', value: 'I\'m just a coder lol 😂' },
                { name: 'Some social', value: 'The links below, are my media' },
            );
        const buttons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Github')
					.setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/jasiukiewicztymon'),
			);

        await interaction.reply({ embeds: [ authorEmbed ], components: [ buttons ] });
	},
};
