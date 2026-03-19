/**
 * Skip Command
 * Skips to next song in queue
 */

const Command = require('./Command');
const { createErrorEmbed, createSuccessEmbed } = require('../utils/embeds');

class SkipCommand extends Command {
  constructor() {
    super({
      name: 'skip',
      description: 'Skip to the next song',
      aliases: ['sk', 'next'],
      category: 'Music',
      usage: '-skip'
    });
  }

  async execute(message, args, { distube }) {
    const queue = distube.getQueue(message);

    if (!queue || !queue.songs[0]) {
      return message.reply({
        embeds: [createErrorEmbed('⚠️ Error', 'No music is currently playing')]
      });
    }

    const currentSong = queue.songs[0];
    queue.skip();

    return message.reply({
      embeds: [createSuccessEmbed('⏭️ Skipped', `Skipped: **${currentSong.name}**`)]
    });
  }
}

module.exports = new SkipCommand();
