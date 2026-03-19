/**
 * Discord Client Events
 * Handles Discord client lifecycle events
 */

const logger = require('../utils/logger');
const config = require('../config');

/**
 * Register all Discord client events
 * @param {Client} client - Discord client instance
 */
function registerClientEvents(client) {
  /**
   * Ready event
   */
  client.on('ready', () => {
    logger.info('✅ Bot ready and operational',
      { botName: client.user.username, userId: client.user.id }
    );

    client.user.setActivity(`${config.DISCORD_PREFIX}help for commands`, {
      type: 'LISTENING'
    });
  });

  /**
   * Guild join
   */
  client.on('guildCreate', (guild) => {
    logger.info('Joined new guild:', { guild: guild.name, guildId: guild.id });
  });

  /**
   * Guild leave
   */
  client.on('guildDelete', (guild) => {
    logger.info('Left guild:', { guild: guild.name, guildId: guild.id });
  });

  /**
   * Error handler
   */
  client.on('error', (error) => {
    logger.error('Discord client error:', { error: error.message, stack: error.stack });
  });

  /**
   * Warn handler
   */
  client.on('warn', (warning) => {
    logger.warn('Discord client warning:', { warning });
  });
}

module.exports = {
  registerClientEvents
};
