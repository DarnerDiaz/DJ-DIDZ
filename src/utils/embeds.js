/**
 * Embed/Message Builders
 * Discord embed creation helpers for consistent styling
 */

const { EmbedBuilder } = require('discord.js');

/**
 * Create a standard embed
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @param {string} color - Hex color code (default: blue)
 * @returns {EmbedBuilder}
 */
function createEmbed(title, description, color = '#0099ff') {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Create success embed (green)
 * @param {string} title - Title
 * @param {string} description - Description
 * @returns {EmbedBuilder}
 */
function createSuccessEmbed(title, description) {
  return createEmbed(title, description, '#00AA00');
}

/**
 * Create error embed (red)
 * @param {string} title - Title
 * @param {string} description - Description
 * @returns {EmbedBuilder}
 */
function createErrorEmbed(title, description) {
  return createEmbed(title, description, '#FF0000');
}

/**
 * Create warning embed (yellow)
 * @param {string} title - Title
 * @param {string} description - Description
 * @returns {EmbedBuilder}
 */
function createWarningEmbed(title, description) {
  return createEmbed(title, description, '#FFAA00');
}

/**
 * Create info embed (blue)
 * @param {string} title - Title
 * @param {string} description - Description
 * @returns {EmbedBuilder}
 */
function createInfoEmbed(title, description) {
  return createEmbed(title, description, '#0099ff');
}

/**
 * Create musical note emoji embed
 * @param {string} title - Title
 * @param {string} description - Description
 * @param {string} color - Color (default: green)
 * @returns {EmbedBuilder}
 */
function createMusicEmbed(title, description, color = '#00AA00') {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle('🎶 ' + title)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Create queue embed with pagination
 * @param {array} songs - Array of song objects
 * @param {number} page - Page number (0-indexed)
 * @param {number} perPage - Items per page (default: 10)
 * @returns {EmbedBuilder}
 */
function createQueueEmbed(songs, page = 0, perPage = 10) {
  if (!songs || songs.length === 0) {
    return createWarningEmbed('📋 Queue', 'Queue is empty');
  }

  const startIdx = page * perPage;
  const endIdx = Math.min(startIdx + perPage, songs.length);
  const pageSongs = songs.slice(startIdx, endIdx);

  const queueList = pageSongs
    .map((song, i) => `${startIdx + i + 1}. **${song.name}** (${song.formattedDuration})`)
    .join('\n');

  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('📋 Queue')
    .setDescription(queueList)
    .setFooter({
      text: `Page ${page + 1} of ${Math.ceil(songs.length / perPage)} | ${songs.length} songs total`
    })
    .setTimestamp();
}

module.exports = {
  createEmbed,
  createSuccessEmbed,
  createErrorEmbed,
  createWarningEmbed,
  createInfoEmbed,
  createMusicEmbed,
  createQueueEmbed
};
