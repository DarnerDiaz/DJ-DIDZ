/**
 * Command Loader
 * Dynamically loads all command modules
 */

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

/**
 * Load all commands from commands directory
 * @returns {Map<string, Object>} Map of command name to command object
 */
function loadCommands() {
  const commandsMap = new Map();
  const commandsDir = __dirname;

  try {
    const files = fs.readdirSync(commandsDir).filter(
      file => file.endsWith('.js') && file !== 'Command.js' && file !== 'loader.js'
    );

    files.forEach(file => {
      try {
        const command = require(path.join(commandsDir, file));

        if (!command || !command.name) {
          logger.warn(`Invalid command file: ${file}`);
          return;
        }

        commandsMap.set(command.name.toLowerCase(), command);

        // Register aliases
        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach(alias => {
            commandsMap.set(alias.toLowerCase(), command);
          });
        }

        logger.debug(`Loaded command: ${command.name}`);
      } catch (error) {
        logger.error(`Error loading command ${file}:`, { error: error.message });
      }
    });

    logger.info(`Loaded ${files.length} commands`);
    return commandsMap;
  } catch (error) {
    logger.error('Error loading commands directory:', { error: error.message });
    return new Map();
  }
}

/**
 * Get command by name or alias
 * @param {Map} commandsMap - Commands map
 * @param {string} name - Command name or alias
 * @returns {Object|undefined}
 */
function getCommand(commandsMap, name) {
  return commandsMap.get(name.toLowerCase());
}

/**
 * Get all unique commands (no aliases)
 * @param {Map} commandsMap - Commands map
 * @returns {Array} Array of command objects
 */
function getAllCommands(commandsMap) {
  const seen = new Set();
  const commands = [];

  commandsMap.forEach(cmd => {
    if (!seen.has(cmd.name.toLowerCase())) {
      seen.add(cmd.name.toLowerCase());
      commands.push(cmd);
    }
  });

  return commands.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  loadCommands,
  getCommand,
  getAllCommands
};
