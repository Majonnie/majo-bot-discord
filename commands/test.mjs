import { SlashCommandBuilder } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Description de test'),
    async execute(interaction) {
	    await interaction.reply('# TEST DE FOU')
    }
}

export default command;