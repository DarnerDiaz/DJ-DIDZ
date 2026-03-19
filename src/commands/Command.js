/**
 * Base Command Class
 * All commands should extend this class
 */

const logger = require('../utils/logger');

/**
 * @typedef {Object} CommandOptions
 * @property {string} name - Command name (lowercase, no spaces)
 * @property {string} description - Short command description
 * @property {string[]} aliases - Alternative command names
 * @property {number} args - Number of required arguments (0 if none)
 * @property {boolean} ownerOnly - Whether command is owner-only
 * @property {string} category - Command category
 * @property {string} usage - Usage example
 */

class Command {
  /**
   * @param {CommandOptions} options - Command configuration
   */
  constructor(options) {
    this.name = options.name.toLowerCase();
    this.description = options.description || '';
    this.aliases = options.aliases || [];
    this.args = options.args || 0;
    this.ownerOnly = options.ownerOnly || false;
    this.category = options.category || 'General';
    this.usage = options.usage || '';
  }

  /**
   * Execute command - must be overridden by subclasses
   * @param {Object} _message - Discord message
   * @param {string[]} _args - Command arguments
   * @param {Object} _data - Additional data (distube, client, etc.)
   * @throws {Error} Command not implemented
   */
  async execute(_message, _args, _data) {
    throw new Error(`Command ${this.name} must implement execute() method`);
  }

  /**
   * Validate command can be executed
   * @param {Object} _message - Discord message
   * @param {string[]} _args - Command arguments
   * @returns {{valid: boolean, error?: string}}
   */
  validate(_message, _args) {
    if (this.args > 0 && _args.length < this.args) {
      return {
        valid: false,
        error: `Missing required arguments. Usage: \`${this.usage}\``
      };
    }
    return { valid: true };
  }

  /**
   * Handle command execution with error handling
   * @param {Object} message - Discord message
   * @param {string[]} args - Command arguments
   * @param {Object} data - Additional data
   */
  async run(message, args, data) {
    try {
      const validation = this.validate(message, args);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      await this.execute(message, args, data);
      logger.info(`Command executed: ${this.name}`, {
        userId: message.author.id,
        username: message.author.username,
        guild: message.guild?.name || 'DM',
        args: args.slice(0, 5) // Log only first 5 args
      });

      return { success: true };
    } catch (error) {
      logger.error(`Error executing command ${this.name}:`, {
        error: error.message,
        stack: error.stack,
        userId: message.author.id
      });

      return { success: false, error: error.message };
    }
  }
}

module.exports = Command;
