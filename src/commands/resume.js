/**
 * Resume Command
 * Resumes paused playback
 */

const Command = require('./Command');
const { createErrorEmbed, createWarningEmbed, createSuccessEmbed } = require('../utils/embeds');

class ResumeCommand extends Command {
  constructor() {
    super({
      name: 'resume',
      description: 'Resume paused music',
      aliases: ['res'],
      category: 'Music',
      usage: '-resume'
    });
  }

  async execute(message, args, { distube }) {
    const queue = distube.getQueue(message);

    if (!queue) {
      return message.reply({
        embeds: [createErrorEmbed('⚠️ Error', 'No music is currently playing')]
      });
    }

    if (!queue.paused) {
      return message.reply({
        embeds: [createWarningEmbed('⚠️ Info', 'Music is already playing')]
      });
    }

    queue.resume();
    return message.reply({
      embeds: [createSuccessEmbed('▶️ Resumed', 'Music resumed')]
    });
  }
}

module.exports = new ResumeCommand();
