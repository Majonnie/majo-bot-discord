import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, EmbedBuilder } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.login(process.env.DISCORD_TOKEN);


const btn = new ButtonBuilder()
        .setCustomId('hiMom')
        .setLabel('Say hi to my Mom !!')
        .setStyle(ButtonStyle.Primary);
        
const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Test Embed')
			.setURL('https://www.instagram.com/majolerigolo')
			.setDescription('Some description here');

//Triggered quand un nouveau message est posté dans le serveur
client.on("messageCreate", async (message) => {
    //Devrait afficher tous les messages postés dans le serveur
    console.log(message);

    //Devrait répondre à chaque utilisateur (s'il n'est pas un bot) avec son propre message
    if (!message.author.bot) {

        //EN COURS interaction avec un bouton
        // message.author.send({
        //     content: 'Push my btns !',
        //     embeds: [embed]
        //     //components: [btn]
        // });

        // Envoi d'un message en DM
        message.author.send({
            //Revoir content vide et affichage createdTimestamp
            content : message.author.username + " a envoyé **\"" + message.content + "\"** | timestamp = " + message.createdTimestamp,
            ephemeral: true
        });
    }
})

//Triggered quand un utilisateur clique sur le bouton btn (d'id "hiMom")
client.on('interactionCreate', async interaction => {

    if (interaction.customId == "hiMom") {

        console.log("Bouton hiMom cliqué !")

        await interaction.reply({
            content: ('Mom says hi back !'),
            ephemeral: true //message temporaire "seul vous pouvez voir ce message"
        });
    }
});