const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');

const { token, clientId, guildId, devStatus } = require('./config.json');
const log = require("./log.js")

const fs = require('fs');
const path = require('path');

// default unit when bot added
var configdc = 'USD'

const client = new Client({ intents: [ GatewayIntentBits.Guilds ] });
client.commands = new Collection();

// commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		log.missCommandPath(filePath)
	}
}

// events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

if (devStatus != 'production' || devStatus != 'prod') {
	// build dev
	const commands = [];
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
	const rest = new REST({ version: '10' }).setToken(token);
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}
else {
	// build prod
	const commands = [];
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
	const rest = new REST({ version: '10' }).setToken(token);
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}

client.once(Events.ClientReady, c => {
	console.log(`🎉 Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
