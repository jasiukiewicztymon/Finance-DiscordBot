const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('price')
		.setDescription('🧾 infos about the stock.'),
	async execute(interaction) {
	},
};