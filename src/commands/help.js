/**
 * Help Command
 * Display available commands
 */

const Command = require('./Command');
const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class HelpCommand extends Command {
  constructor() {
    super({
      name: 'help',
      description: 'Show all available commands',
      aliases: ['h', '?'],
      category: 'General',
      usage: '-help'
    });
  }

  async execute(message, args, { allCommands }) {
    // Group commands by category
    const categories = {};

    allCommands.forEach(cmd => {
      const category = cmd.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(cmd);
    });

    // Build help embed
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📖 DJ DIDZ Commands')
      .setDescription(`Prefix: \`${config.DISCORD_PREFIX}\`\nType \`${config.DISCORD_PREFIX}help <command>\` for more info`)
      .setFooter({ text: 'DJ DIDZ v2.0.0 - Powered from Arequipa' })
      .setTimestamp();

    // Add fields for each category
    Object.keys(categories).sort().forEach(category => {
      const commands = categories[category];
      const cmdList = commands
        .map(cmd => `\`${config.DISCORD_PREFIX}${cmd.name}\` - ${cmd.description}`)
        .join('\n');

      embed.addFields({ name: `**${category}**`, value: cmdList || 'No commands', inline: false });
    });

    return message.reply({ embeds: [embed] });
  }
}

module.exports = new HelpCommand();
