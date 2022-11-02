const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('🛠 Get some help.'),
	async execute(interaction) {
	},
};