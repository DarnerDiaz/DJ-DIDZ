/**
 * Rate Limiter Middleware
 * Prevents command spam and abuse
 */

const logger = require('../utils/logger');
const config = require('../config');

/**
 * @typedef {Object} UserCooldown
 * @property {number} lastCommand - Timestamp of last command
 * @property {number} commandCount - Number of commands in current window
 */

/** @type {Map<string, UserCooldown>} */
const cooldowns = new Map();

/**
 * Rate limit middleware
 * @param {Object} message - Discord message object
 * @returns {{allowed: boolean, retryAfter?: number}}
 */
function checkRateLimit(message) {
  if (!config.RATE_LIMIT_ENABLED) {
    return { allowed: true };
  }

  const userId = message.author.id;
  const now = Date.now();
  const windowMs = config.RATE_LIMIT_WINDOW_MS;
  const maxCommands = config.RATE_LIMIT_MAX_COMMANDS;

  let userCooldown = cooldowns.get(userId);

  if (!userCooldown) {
    userCooldown = {
      lastCommand: now,
      commandCount: 1
    };
    cooldowns.set(userId, userCooldown);
    return { allowed: true };
  }

  const timePassed = now - userCooldown.lastCommand;

  // Reset window if time has passed
  if (timePassed > windowMs) {
    userCooldown.lastCommand = now;
    userCooldown.commandCount = 1;
    return { allowed: true };
  }

  // Increment command count
  userCooldown.commandCount++;

  if (userCooldown.commandCount > maxCommands) {
    const retryAfter = Math.ceil((windowMs - timePassed) / 1000);
    logger.warn('Rate limit exceeded', {
      userId,
      commandCount: userCooldown.commandCount,
      maxCommands,
      retryAfter
    });
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

/**
 * Clear all cooldowns (use sparingly)
 */
function clearCooldowns() {
  cooldowns.clear();
  logger.info('Rate limit cooldowns cleared');
}

/**
 * Clear specific user cooldown
 * @param {string} userId - Discord user ID
 */
function clearUserCooldown(userId) {
  cooldowns.delete(userId);
}

/**
 * Get current cooldown info for user
 * @param {string} userId - Discord user ID
 * @returns {UserCooldown|null}
 */
function getUserCooldown(userId) {
  return cooldowns.get(userId) || null;
}

module.exports = {
  checkRateLimit,
  clearCooldowns,
  clearUserCooldown,
  getUserCooldown
};
