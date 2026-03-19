/**
 * Stop Command
 * Stops music playback completely
 */

const Command = require('./Command');
const { createErrorEmbed, createSuccessEmbed } = require('../utils/embeds');

class StopCommand extends Command {
  constructor() {
    super({
      name: 'stop',
      description: 'Stop music playback',
      aliases: ['s'],
      category: 'Music',
      usage: '-stop'
    });
  }

  async execute(message, args, { distube }) {
    const queue = distube.getQueue(message);

    if (!queue) {
      return message.reply({
        embeds: [createErrorEmbed('⚠️ Error', 'No music is currently playing')]
      });
    }

    distube.stop(message);
    return message.reply({
      embeds: [createSuccessEmbed('⏹️ Stopped', 'Music stopped. DJ DIDZ going offline.')]
    });
  }
}

module.exports = new StopCommand();
