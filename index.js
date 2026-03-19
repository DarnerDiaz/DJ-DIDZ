#!/usr/bin/env node

/**
 * DJ DIDZ - Advanced Discord Music Bot
 * Main entry point with refactored, modular architecture
 * 
 * Development: npm run dev
 * Production: npm start
 */

require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const ffmpeg = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

// Import utilities and modules
const logger = require('./src/utils/logger');
const config = require('./src/config');
const { loadCommands, getCommand, getAllCommands } = require('./src/commands/loader');
const { registerDistubeEvents } = require('./src/events/distube');
const { registerClientEvents } = require('./src/events/client');
const { checkRateLimit } = require('./src/middleware/rateLimiter');
const { createErrorEmbed } = require('./src/utils/embeds');

/**
 * Validate configuration before startup
 */
function validateSetup() {
  try {
    config.validateConfig();
    logger.info('✅ Configuration validated');
    return true;
  } catch (error) {
    logger.error('❌ Configuration validation failed:', { error: error.message });
    process.exit(1);
  }
}

/**
 * Initialize Discord client
 */
function initializeClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ]
  });

  logger.info('Discord client initialized');
  return client;
}

/**
 * Initialize DisTube
 */
function initializeDistube(client) {
  const distube = new DisTube(client, {
    plugins: [
      new YouTubePlugin({
        ytdlOptions: {
          highWaterMark: 1 << 25,
          filter: 'audioonly',
          quality: 'highestaudio'
        }
      })
    ],
    emitNewSongOnly: true,
    ffmpeg: { path: ffmpeg },
    leaveOnFinish: false,
    leaveOnEmpty: true,
    emptyCooldown: 60000
  });

  logger.info('DisTube initialized');
  return distube;
}

/**
 * Setup heartbeat for health checks
 */
function setupHeartbeat() {
  const heartbeatInterval = setInterval(() => {
    const heartbeatFile = path.join(__dirname, '.heartbeat');
    fs.writeFile(heartbeatFile, Date.now().toString(), (err) => {
      if (err) {
        logger.error('Error writing heartbeat:', { error: err.message });
      }
    });
  }, 30000); // Every 30 seconds

  logger.info('Heartbeat monitoring started');
  return heartbeatInterval;
}

/**
 * Main application startup
 */
async function start() {
  logger.info('╔════════════════════════════════════════╗');
  logger.info('║     DJ DIDZ - Music Bot Starting      ║');
  logger.info('║  Advanced Discord Music Experience    ║');
  logger.info('╚════════════════════════════════════════╝');

  // Validate configuration
  validateSetup();

  // Initialize client and distube
  const client = initializeClient();
  const distube = initializeDistube(client);

  // Load commands
  const commandsMap = loadCommands();
  const allCommands = getAllCommands(commandsMap);

  logger.info(`Loaded ${allCommands.length} unique commands`);

  // Register event handlers
  registerClientEvents(client);
  registerDistubeEvents(distube);

  // Setup heartbeat
  setupHeartbeat();

  /**
   * Message create handler - main command processor
   */
  client.on('messageCreate', async (message) => {
    // Ignore own messages and non-command messages
    if (message.author.bot || !message.content.startsWith(config.DISCORD_PREFIX)) {
      return;
    }

    // Parse command and arguments
    const args = message.content.slice(config.DISCORD_PREFIX.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // Rate limiting check
    const rateLimitCheck = checkRateLimit(message);
    if (!rateLimitCheck.allowed) {
      const retryAfter = rateLimitCheck.retryAfter || 5;
      logger.warn('Rate limit triggered', { userId: message.author.id, retryAfter });
      return message.reply({
        embeds: [createErrorEmbed(
          '⏳ Rate Limited',
          `Please wait ${retryAfter}s before using another command.`
        )]
      });
    }

    // Get command
    const command = getCommand(commandsMap, commandName);

    if (!command) {
      // Silent fail - don't respond to unknown commands
      logger.debug('Unknown command attempted', { command: commandName, user: message.author.username });
      return;
    }

    try {
      logger.debug('Executing command:', {
        command: command.name,
        user: message.author.username,
        guild: message.guild?.name || 'DM',
        args: args.slice(0, 3)
      });

      // Execute command
      const result = await command.run(
        message,
        args,
        {
          distube,
          client,
          allCommands,
          config
        }
      );

      if (!result.success && result.error) {
        logger.warn(`Command execution failed: ${command.name}`, { error: result.error });
      }
    } catch (error) {
      logger.error(`Critical error executing command ${command.name}:`, {
        error: error.message,
        stack: error.stack
      });

      message.reply({
        embeds: [createErrorEmbed('❌ Critical Error', 'An unexpected error occurred. Please try again later.')]
      }).catch(err => logger.error('Error sending error message:', { error: err.message }));
    }
  });

  /**
   * Handle process-level errors
   */
  process.on('unhandledRejection', (_reason, _promise) => {
    logger.error('Unhandled Promise Rejection:', { reason: String(_reason) });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    // Don't exit - let the bot keep running
  });

  /**
   * Graceful shutdown
   */
  process.on('SIGINT', async () => {
    logger.info('Shutdown signal received, closing gracefully...');
    await client.destroy();
    process.exit(0);
  });

  // Login to Discord
  try {
    await client.login(config.DISCORD_TOKEN);
    logger.info('🎉 Bot successfully logged into Discord');
  } catch (error) {
    logger.error('Failed to login to Discord:', { error: error.message });
    process.exit(1);
  }
}

// Start the bot
start().catch(error => {
  logger.error('Fatal startup error:', { error: error.message });
  process.exit(1);
});