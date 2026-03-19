/**
 * Pause Command
 * Pauses current playback
 */

const Command = require('./Command');
const { createErrorEmbed, createWarningEmbed, createSuccessEmbed } = require('../utils/embeds');

class PauseCommand extends Command {
  constructor() {
    super({
      name: 'pause',
      description: 'Pause the current song',
      aliases: ['pa'],
      category: 'Music',
      usage: '-pause'
    });
  }

  async execute(message, args, { distube }) {
    const queue = distube.getQueue(message);

    if (!queue) {
      return message.reply({
        embeds: [createErrorEmbed('⚠️ Error', 'No music is currently playing')]
      });
    }

    if (queue.paused) {
      return message.reply({
        embeds: [createWarningEmbed('⚠️ Info', 'Music is already paused')]
      });
    }

    queue.pause();
    return message.reply({
      embeds: [createSuccessEmbed('⏸️ Paused', 'Music paused')]
    });
  }
}

module.exports = new PauseCommand();
