import { SlashCommandBuilder } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Replies with Cat! (temp)'),
    async execute(interaction) {
	    await interaction.reply('Cat de MAJO!')
    }
}

export default command;

