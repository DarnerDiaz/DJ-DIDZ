/**
 * Volume Command
 * Adjust playback volume
 */

const Command = require('./Command');
const { createErrorEmbed, createSuccessEmbed, createWarningEmbed } = require('../utils/embeds');
const { validateIntRange } = require('../utils/validators');

class VolumeCommand extends Command {
  constructor() {
    super({
      name: 'volume',
      description: 'Set the playback volume',
      aliases: ['vol', 'v'],
      args: 1,
      category: 'Music',
      usage: '-volume <0-100>'
    });
  }

  async execute(message, args, { distube }) {
    const queue = distube.getQueue(message);

    if (!queue) {
      return message.reply({
        embeds: [createErrorEmbed('⚠️ Error', 'No music is currently playing')]
      });
    }

    if (args.length === 0) {
      return message.reply({
        embeds: [createWarningEmbed('🔊 Current Volume', `Volume is at **${queue.volume}%**`)]
      });
    }

    const volValidation = validateIntRange(args[0], 0, 100);
    if (!volValidation.valid) {
      return message.reply({
        embeds: [createErrorEmbed('⚠️ Error', volValidation.error)]
      });
    }

    queue.setVolume(volValidation.value);

    return message.reply({
      embeds: [createSuccessEmbed('🔊 Volume', `Volume set to **${volValidation.value}%**`)]
    });
  }
}

module.exports = new VolumeCommand();
