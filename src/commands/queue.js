/**
 * Queue Command
 * Display current music queue
 */

const Command = require('./Command');
const { createWarningEmbed, createQueueEmbed } = require('../utils/embeds');
const { validateIntRange } = require('../utils/validators');

class QueueCommand extends Command {
  constructor() {
    super({
      name: 'queue',
      description: 'Show the current music queue',
      aliases: ['q'],
      category: 'Music',
      usage: '-queue [page]'
    });
  }

  async execute(message, args, { distube }) {
    const queue = distube.getQueue(message);

    if (!queue || queue.songs.length === 0) {
      return message.reply({
        embeds: [createWarningEmbed('📋 Queue', 'Queue is empty')]
      });
    }

    let page = 0;

    if (args.length > 0) {
      const pageValidation = validateIntRange(args[0], 1, 100);
      if (!pageValidation.valid) {
        return message.reply({
          embeds: [createWarningEmbed('⚠️ Error', pageValidation.error)]
        });
      }
      page = pageValidation.value - 1;
    }

    const perPage = 10;
    const maxPages = Math.ceil(queue.songs.length / perPage);

    if (page >= maxPages) {
      return message.reply({
        embeds: [createWarningEmbed('⚠️ Error', `Page ${page + 1} does not exist`)]
      });
    }

    const embed = createQueueEmbed(queue.songs, page, perPage);
    return message.reply({ embeds: [embed] });
  }
}

module.exports = new QueueCommand();
