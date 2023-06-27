//Imports
import { Client, GatewayIntentBits, ButtonBuilder, ModalBuilder, TextInputBuilder,
    TextInputStyle, ButtonStyle, EmbedBuilder, Collection, Events } from 'discord.js';

import dotenv from 'dotenv';
dotenv.config();

import fs from 'node:fs';
import path from "node:path";
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

//Connexion du bot
let client = login_bot();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag} !!!!`);
    client.command = await get_commands("commands");
    //console.log(client.command);
});


//Fonctions
function login_bot(){
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            // Intents.FLAGS.GUILDS,
            // Intents.FLAGS.GUILD_MESSAGES
        ],
    });

    client.login(process.env.DISCORD_TOKEN);

    return client;
}

async function get_commands(folder) {
    const commandsPath = path.join(dirname, folder);
    //Liste des fichiers de commandes
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.mjs'));
    //Collection qui contiendra toutes les commandes du dossier folder
    let commands_collection = new Collection();

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command.default && 'execute' in command.default) {
            commands_collection.set(command.default.data.name, command.default);
            console.log("Commande " + command.default.data.name + " enregistrée.");
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    };

    return commands_collection;
}

//À factoriser
const btn = new ButtonBuilder()
        .setCustomId('hiMom')
        .setLabel('Say hi to my Mom !!')
        .setStyle(ButtonStyle.Primary);
        
const embed = new EmbedBuilder()
			.setColor(0xFFFFFF)
			.setTitle('Instagram')
            .setAuthor({ name: 'Majonnie', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setURL('https://www.instagram.com/majolerigolo')
			.setDescription('Mon compte Instagram de dessin !');


//Triggered quand un nouveau message est posté dans le serveur
client.on("messageCreate", async (message) => {

    //Devrait répondre à chaque utilisateur (s'il n'est pas un bot) avec son propre message
    if (!message.author.bot) { //true si un bot a envoyé le message, false sinon

        //Devrait afficher tous les messages postés dans le serveur par des utilisateurs (non bots)
        console.log(message);

        //EN COURS interaction avec un bouton
        //!! À REVOIR !!
        // message.author.send({
        //     content: 'Push my btns !',
        //     //embeds: [embed],
        //     components: [btn]
        // });
        
        read_attachments(message);

        send_dm(message);

        send_reply(message, 0);
    }
});

client.on('interactionCreate', async interaction => {
	await test_interaction(interaction);
});


//Fonctions (à mieux organiser)
function send_dm(message) {
    /** Fonction envoyant un message en DM. */
    message.author.send({
        //Revoir content vide et affichage createdTimestamp
        content : message.author.username + " a envoyé **\"" + message.content + "\"** | timestamp = " + message.createdTimestamp,
        //à revoir
        //ephemeral: true
    });
}

function send_reply(message, time) {
    /** Fonction répondant à un message directement dans le serveur. */
        setTimeout(function(){
            message.reply({
            content: "Réponse de fou au message \"" + message.content + "\" de " + message.author.username,
            ephemeral: true
        });
        }, time);
}

function read_attachments(message) {
    //** Fonction listant les informations de toutes les pièces jointes d'un message. */
        if (message.attachments) {
            message.attachments.forEach(element => {
                console.log("name = " + element.name);
                console.log("contentType = " + element.contentType);
                console.log("url = " + element.url);
                console.log(element);
            });
        }
}

//Fonction temporaire pour gérer problème récup interactions
async function test_interaction(interaction) {
    console.log("wow interaction");

    console.log(interaction)

    if (interaction.isChatInputCommand()) {
        console.log("Commande je crois");
    }

    try {
        const command = client.command.get(interaction.commandName);
        console.log(command);
        command.execute(interaction);
        console.log("Commande " + interaction.commandName + " trouvée !!");
    }
    catch {
        console.log(client.command);
        console.log("La commande " + interaction.commandName + " n'a pas l'air d'exister...");
    }

    //Si l'interaction est une commande
    /*
    if (!interaction.isChatInputCommand()) {
        console.log("Commande je crois");
	    console.log(interaction);

        //Si la commande entrée n'existe pas
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        //On tente d'exécuter la commande
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    */

    //Triggered quand un utilisateur clique sur le bouton btn (d'id "hiMom")
    // if (interaction.customId == "hiMom") {

    //     console.log("Bouton hiMom cliqué !")

    //     await interaction.reply({
    //         content: ('Mom says hi back !'),
    //         ephemeral: true //message temporaire "seul vous pouvez voir ce message"
    //     });
    // }
}
