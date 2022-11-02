const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('symbol')
		.setDescription('💱 symbol system.'),
	async execute(interaction) {
	},
};