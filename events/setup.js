const { Events } = require('discord.js');
const log = require("../log.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		log.botReadyMessage(client.user.tag);
	},
};