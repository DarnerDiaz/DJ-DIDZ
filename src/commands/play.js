/**
 * Play Command
 * Plays a song from YouTube/Spotify search
 */

const Command = require('./Command');
const { createErrorEmbed } = require('../utils/embeds');
const { validateVoiceChannel, validateString } = require('../utils/validators');
const logger = require('../utils/logger');

class PlayCommand extends Command {
  constructor() {
    super({
      name: 'play',
      description: 'Play a song from YouTube or Spotify',
      aliases: ['p'],
      args: 1,
      category: 'Music',
      usage: '-play <song name or URL>'
    });
  }

  async execute(message, args, { distube }) {
    // Validate voice channel
    const voiceCheck = validateVoiceChannel(message.member);
    if (!voiceCheck.valid) {
      return message.reply({ embeds: [createErrorEmbed('⚠️ Error', voiceCheck.error)] });
    }

    // Validate query
    const query = args.join(' ');
    const queryCheck = validateString(query, 2, 200);
    if (!queryCheck.valid) {
      return message.reply({ embeds: [createErrorEmbed('⚠️ Error', queryCheck.error)] });
    }

    try {
      await distube.play(voiceCheck.channel, queryCheck.value, {
        message,
        textChannel: message.channel,
        member: message.member
      });

      logger.debug('Play command executed', { query: queryCheck.value });
    } catch (error) {
      logger.error('Play command error:', { error: error.message });
      return message.reply({
        embeds: [createErrorEmbed('❌ Error', 'Could not play song: ' + error.message)]
      });
    }
  }
}

module.exports = new PlayCommand();
