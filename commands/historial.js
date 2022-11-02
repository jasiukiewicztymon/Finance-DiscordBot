const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('historial')
		.setDescription('📈 stock graph.'),
	async execute(interaction) {
	},
};