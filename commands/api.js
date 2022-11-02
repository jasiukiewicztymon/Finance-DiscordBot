const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('api')
		.setDescription('✨ About api embed message!'),
	async execute(interaction) {
	},
};