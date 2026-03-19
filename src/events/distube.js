/**
 * DisTube Events Handler
 * Handles music-related events
 */

const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

/**
 * Register all DisTube event listeners
 * @param {DisTube} distube - DisTube instance
 */
function registerDistubeEvents(distube) {
  /**
   * Error event
   */
  distube.on('error', (channel, error) => {
    logger.error('DisTube error:', { error: error.message });

    const errorMsg = (error && error.message) ? error.message.slice(0, 100) : 'Failed to stream from YouTube';

    if (channel && typeof channel.send === 'function') {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Playback Error')
        .setDescription(errorMsg)
        .setTimestamp();

      channel.send({ embeds: [embed] }).catch(err => {
        logger.error('Error sending error message:', { error: err.message });
      });
    }
  });

  /**
   * Now playing event
   */
  distube.on('playSong', (queue, song) => {
    logger.info('Now playing:', { song: song.name, guild: queue.textChannel.guild.name });

    const embed = new EmbedBuilder()
      .setColor('#00AA00')
      .setTitle('🎶 Now Playing')
      .setDescription(`**${song.name}**`)
      .addFields(
        { name: '⏱️ Duration', value: song.formattedDuration, inline: true },
        { name: '👤 Requested by', value: `${song.user || 'Unknown'}`, inline: true }
      )
      .setThumbnail(song.thumbnail || null)
      .setTimestamp();

    queue.textChannel.send({ embeds: [embed] }).catch(err => {
      logger.error('Error sending now playing message:', { error: err.message });
    });
  });

  /**
   * Song added to queue
   */
  distube.on('addSong', (queue, song) => {
    logger.info('Song added to queue:', { song: song.name });

    const embed = new EmbedBuilder()
      .setColor('#FFAA00')
      .setDescription(`✅ **${song.name}** added to queue.`);

    queue.textChannel.send({ embeds: [embed] }).catch(err => {
      logger.error('Error sending add song message:', { error: err.message });
    });
  });

  /**
   * Playlist added
   */
  distube.on('addList', (queue, playlist) => {
    logger.info('Playlist added:', { playlist: playlist.name, songs: playlist.songs.length });

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setDescription(`📋 **${playlist.name}** (${playlist.songs.length} songs) added to queue.`);

    queue.textChannel.send({ embeds: [embed] }).catch(err => {
      logger.error('Error sending playlist message:', { error: err.message });
    });
  });

  /**
   * Queue finished
   */
  distube.on('finish', (queue) => {
    logger.info('Queue finished:', { guild: queue.textChannel.guild.name });

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setDescription('✅ Queue finished. Thanks for listening to DJ DIDZ!');

    queue.textChannel.send({ embeds: [embed] }).catch(err => {
      logger.error('Error sending finish message:', { error: err.message });
    });
  });

  /**
   * Bot disconnected from voice
   */
  distube.on('disconnect', (queue) => {
    logger.info('Bot disconnected:', { guild: queue.textChannel.guild.name });
  });
}

module.exports = {
  registerDistubeEvents
};
