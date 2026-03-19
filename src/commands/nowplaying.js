/**
 * Now Playing Command
 * Display current song information
 */

const Command = require('./Command');
const { EmbedBuilder } = require('discord.js');
const { createErrorEmbed } = require('../utils/embeds');

class NowPlayingCommand extends Command {
  constructor() {
    super({
      name: 'nowplaying',
      description: 'Show the currently playing song',
      aliases: ['np', 'current'],
      category: 'Music',
      usage: '-nowplaying'
    });
  }

  async execute(message, args, { distube }) {
    const queue = distube.getQueue(message);

    if (!queue || !queue.songs[0]) {
      return message.reply({
        embeds: [createErrorEmbed('⚠️ Error', 'No music is currently playing')]
      });
    }

    const song = queue.songs[0];

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎶 Now Playing')
      .setDescription(`**${song.name}**`)
      .addFields(
        { name: '⏱️ Duration', value: song.formattedDuration, inline: true },
        { name: '🔊 Volume', value: `${queue.volume}%`, inline: true },
        { name: '👤 Requested by', value: `${song.user || 'Unknown'}`, inline: false }
      )
      .setThumbnail(song.thumbnail || null)
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
}

module.exports = new NowPlayingCommand();
