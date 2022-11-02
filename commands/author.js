const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('author')
		.setDescription('✨ About author embed message!'),
	async execute(interaction) {
        const authorEmbed = new DiscordJS.MessageEmbed()
            .setTitle('Author information')
            .setColor('#18A31F')
            .setDescription('Here you can yound some information about the author')
            .addFields(
                { name: 'Who I am', value: 'I\' a junior discord.js developer who learn using public APIs' },
                { name: 'Some social', value: 'The links below, are my media' },
            );

        await interaction.post({
            data: {
                embeds: [authorEmbed],
                components: [
                    {
                    type: 1,
                    components: [
                        {
                        type: 2,
                        style: 5,
                        label: "GitHub",
                        url: "https://github.com/jasiukiewicztymon"
                    }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                        type: 2,
                        style: 5,
                        label: "Instagram",
                        url: "https://www.instagram.com/titi_2115/?hl=fr"
                        }
                    ]
                }
            ]
            }
        });
	},
};