/**
 * Data Persistence Layer
 * Uses JSON-based storage (portable alternative to SQLite)
 * For production, consider migrating to actual SQLite or PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class BotDatabase {
  constructor() {
    this.dbDir = path.join(__dirname, '../../', 'data');
    this.favoritesFile = path.join(this.dbDir, 'favorites.json');
    this.statsFile = path.join(this.dbDir, 'stats.json');
    this.settingsFile = path.join(this.dbDir, 'settings.json');

    this.ensureDbDirectory();
    this.loadData();
    logger.info('Database initialized (JSON-based storage)');
  }

  /**
   * Ensure database directory exists
   */
  ensureDbDirectory() {
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
    }
  }

  /**
   * Load all data from files
   */
  loadData() {
    this.favorites = this.loadFile(this.favoritesFile, {});
    this.stats = this.loadFile(this.statsFile, {});
    this.settings = this.loadFile(this.settingsFile, {});
  }

  /**
   * Load JSON file with fallback
   * @param {string} filePath - File path
   * @param {Object} defaultValue - Default value if file doesn't exist
   */
  loadFile(filePath, defaultValue = {}) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      logger.error('Error loading file:', { file: filePath, error: error.message });
    }
    return defaultValue;
  }

  /**
   * Save data to file
   * @param {string} filePath - File path
   * @param {Object} data - Data to save
   */
  saveFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      logger.error('Error saving file:', { file: filePath, error: error.message });
      return false;
    }
  }

  /**
   * Add song to server favorites
   * @param {string} serverId - Discord server ID
   * @param {string} songName - Song name
   * @param {string} songUrl - Song URL
   * @param {string} userId - User ID
   */
  addFavorite(serverId, songName, songUrl, userId) {
    try {
      if (!this.favorites[serverId]) {
        this.favorites[serverId] = [];
      }

      const exists = this.favorites[serverId].some(fav => fav.songUrl === songUrl);
      if (!exists) {
        this.favorites[serverId].push({
          songName,
          songUrl,
          userId,
          addedAt: new Date().toISOString()
        });
        this.saveFile(this.favoritesFile, this.favorites);
      }
      return true;
    } catch (error) {
      logger.error('Error adding favorite:', { error: error.message });
      return false;
    }
  }

  /**
   * Get server favorites
   * @param {string} serverId - Discord server ID
   * @returns {Array}
   */
  getFavorites(serverId) {
    return this.favorites[serverId] || [];
  }

  /**
   * Update user statistics
   * @param {string} userId - Discord user ID
   */
  updateUserStats(userId) {
    try {
      if (!this.stats[userId]) {
        this.stats[userId] = {
          commandsUsed: 0,
          songsPlayed: 0,
          firstSeen: new Date().toISOString()
        };
      }

      this.stats[userId].commandsUsed++;
      this.stats[userId].lastCommand = new Date().toISOString();
      this.saveFile(this.statsFile, this.stats);
      return true;
    } catch (error) {
      logger.error('Error updating stats:', { error: error.message });
      return false;
    }
  }

  /**
   * Get user statistics
   * @param {string} userId - Discord user ID
   * @returns {Object|null}
   */
  getUserStats(userId) {
    return this.stats[userId] || null;
  }

  /**
   * Get server settings
   * @param {string} serverId - Discord server ID
   * @returns {Object|null}
   */
  getServerSettings(serverId) {
    return this.settings[serverId] || null;
  }

  /**
   * Update server settings
   * @param {string} serverId - Discord server ID
   * @param {Object} newSettings - Settings object
   */
  updateServerSettings(serverId, newSettings) {
    try {
      this.settings[serverId] = {
        ...this.settings[serverId],
        ...newSettings,
        updatedAt: new Date().toISOString()
      };
      this.saveFile(this.settingsFile, this.settings);
      return true;
    } catch (error) {
      logger.error('Error updating server settings:', { error: error.message });
      return false;
    }
  }

  /**
   * Get all data for backup/export
   */
  exportData() {
    return {
      favorites: this.favorites,
      stats: this.stats,
      settings: this.settings,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Clear all data (use with caution)
   */
  clearAll() {
    this.favorites = {};
    this.stats = {};
    this.settings = {};
    this.saveFile(this.favoritesFile, this.favorites);
    this.saveFile(this.statsFile, this.stats);
    this.saveFile(this.settingsFile, this.settings);
    logger.warn('All data cleared');
  }
}

module.exports = new BotDatabase();
