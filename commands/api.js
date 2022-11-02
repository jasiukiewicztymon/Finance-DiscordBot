const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('api')
		.setDescription('✨ About API embed message!'),
	async execute(interaction) {
        const authorEmbed = new EmbedBuilder()
            .setTitle('API information')
            .setColor(0x06D6A0)
            .setDescription('Here you can found some information about the API ✨')
            .addFields(
                { name: 'Why Yahoo finance API', value: 'We have choose the Yahoo finance API, because it\'s free and have a relative good docs and easy in use' },
                { name: '\u200B', value: '\u200B' },
                { name: 'More information', value: 'You can get more information, clicking the button below' },
            );
        const buttons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('More')
					.setStyle(ButtonStyle.Link)
                    .setURL('https://www.yahoofinanceapi.com/'),
			);

        await interaction.reply({ embeds: [ authorEmbed ], components: [ buttons ] });
	},
};
