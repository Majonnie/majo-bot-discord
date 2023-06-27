import { SlashCommandBuilder } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('quoi')
        .setDescription('Replies with Feur!'),
    async execute(interaction) {
	    await interaction.reply('# feur')
    }
}

export default command;