/**
 * Global Configuration
 * Centralized environment and settings management
 */

require('dotenv').config();

/**
 * @typedef {Object} Config
 * @property {string} DISCORD_TOKEN - Discord bot token
 * @property {string} DISCORD_PREFIX - Command prefix
 * @property {string} BOT_NAME - Bot display name
 * @property {string} NODE_ENV - Environment (development|production)
 * @property {string} LOG_LEVEL - Logging level
 * @property {string} LOG_FILE - Log file path
 * @property {boolean} ENABLE_AUTOCORRECT - Enable command autocorrect
 * @property {number} AUTOCORRECT_TIMEOUT - Autocorrect timeout in ms
 * @property {boolean} RATE_LIMIT_ENABLED - Enable rate limiting
 * @property {number} RATE_LIMIT_MAX_COMMANDS - Max commands per window
 * @property {number} RATE_LIMIT_WINDOW_MS - Rate limit window in ms
 * @property {string} DATABASE_PATH - SQLite database path
 * @property {number} DEFAULT_VOLUME - Default volume (0-100)
 * @property {number} PREMIUM_MAX_QUEUE_SIZE - Max queue for premium users
 * @property {number} FREE_MAX_QUEUE_SIZE - Max queue for free users
 */

const config = {
  // Discord Configuration
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
  DISCORD_PREFIX: process.env.DISCORD_PREFIX || '-',
  BOT_NAME: process.env.BOT_NAME || 'DJ DIDZ',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || 'logs/bot.log',

  // Autocorrect
  ENABLE_AUTOCORRECT: process.env.ENABLE_AUTOCORRECT === 'true',
  AUTOCORRECT_TIMEOUT: parseInt(process.env.AUTOCORRECT_TIMEOUT) || 5000,

  // Rate Limiting
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED === 'true',
  RATE_LIMIT_MAX_COMMANDS: parseInt(process.env.RATE_LIMIT_MAX_COMMANDS) || 5,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 10000,

  // Database
  DATABASE_PATH: process.env.DATABASE_PATH || 'data/bot.db',

  // Voice Settings
  DEFAULT_VOLUME: parseInt(process.env.DEFAULT_VOLUME) || 50,
  PREMIUM_MAX_QUEUE_SIZE: parseInt(process.env.PREMIUM_MAX_QUEUE_SIZE) || 100,
  FREE_MAX_QUEUE_SIZE: parseInt(process.env.FREE_MAX_QUEUE_SIZE) || 50
};

/**
 * Validate required configuration
 */
function validateConfig() {
  if (!config.DISCORD_TOKEN || config.DISCORD_TOKEN === 'your_bot_token_here') {
    throw new Error('❌ DISCORD_TOKEN is not configured in .env file');
  }
  return true;
}

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
function get(key) {
  return config[key];
}

/**
 * Check if in production
 * @returns {boolean} True if production environment
 */
function isProduction() {
  return config.NODE_ENV === 'production';
}

/**
 * Check if in development
 * @returns {boolean} True if development environment
 */
function isDevelopment() {
  return config.NODE_ENV === 'development';
}

module.exports = {
  ...config,
  validateConfig,
  get,
  isProduction,
  isDevelopment
};
