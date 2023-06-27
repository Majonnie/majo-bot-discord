import { REST, Routes } from 'discord.js';
import config from './config.json' assert { type: "json" };
import fs from 'node:fs';
import path from "node:path";

const commands = [];
// Grab all the command files from the commands directory you created earlier
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const commandsPath = path.join(dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.mjs'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    console.log(command.default.data);
	//const command = require(`./commands/${file}`);
	//commands.push(command.data.toJSON());
    commands.push(command.default.data); //bloque ici
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

        //Commandes spécifiques à un serveur (préférable pour les tests)
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands },
		);

        //Commandes globales
        // await rest.put(s
    	//     Routes.applicationCommands(config.clientId),
	    //     { body: commands },
        // );

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();