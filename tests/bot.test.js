/**
 * DJ DIDZ Bot Tests
 * Comprehensive test suite using Jest
 */

describe('DJ DIDZ Bot - Configuration Tests', () => {
  describe('Environment Variables', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    test('Should validate required DISCORD_TOKEN', () => {
      process.env.DISCORD_TOKEN = 'valid_token_12345';
      const config = require('../src/config');
      expect(() => config.validateConfig()).not.toThrow();
    });

    test('Should throw error when DISCORD_TOKEN is missing', () => {
      process.env.DISCORD_TOKEN = '';
      jest.resetModules();
      const config = require('../src/config');
      expect(() => config.validateConfig()).toThrow('DISCORD_TOKEN is not configured');
    });

    test('Should have valid PREFIX setting', () => {
      process.env.DISCORD_PREFIX = '-';
      const config = require('../src/config');
      expect(config.DISCORD_PREFIX).toBe('-');
    });

    test('Should provide isDevelopment and isProduction functions', () => {
      process.env.NODE_ENV = 'development';
      jest.resetModules();
      const config = require('../src/config');
      expect(config.isDevelopment()).toBe(true);
      expect(config.isProduction()).toBe(false);
    });
  });

  describe('Dependencies', () => {
    test('discord.js should be installed', () => {
      const discord = require('discord.js');
      expect(discord).toBeDefined();
      expect(discord.Client).toBeDefined();
    });

    test('distube should be installed', () => {
      const { DisTube } = require('distube');
      expect(DisTube).toBeDefined();
    });

    test('ffmpeg-static should be available', () => {
      const ffmpeg = require('ffmpeg-static');
      expect(ffmpeg).toBeDefined();
    });

    test('winston logger should be installed', () => {
      const winston = require('winston');
      expect(winston).toBeDefined();
      expect(winston.createLogger).toBeDefined();
    });

    test('dotenv should be installed', () => {
      const dotenv = require('dotenv');
      expect(dotenv).toBeDefined();
    });
  });

  describe('Project Structure', () => {
    const fs = require('fs');

    test('index.js should exist', () => {
      expect(fs.existsSync('./index.js')).toBe(true);
    });

    test('package.json should be valid', () => {
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      expect(pkg.name).toBe('dj-didz');
      expect(pkg.main).toBe('index.js');
      expect(pkg.scripts).toBeDefined();
    });

    test('src directory structure should exist', () => {
      expect(fs.existsSync('./src')).toBe(true);
      expect(fs.existsSync('./src/commands')).toBe(true);
      expect(fs.existsSync('./src/events')).toBe(true);
      expect(fs.existsSync('./src/utils')).toBe(true);
      expect(fs.existsSync('./src/config')).toBe(true);
      expect(fs.existsSync('./src/middleware')).toBe(true);
    });

    test('Essential utilities should exist', () => {
      expect(fs.existsSync('./src/utils/logger.js')).toBe(true);
      expect(fs.existsSync('./src/utils/validators.js')).toBe(true);
      expect(fs.existsSync('./src/utils/embeds.js')).toBe(true);
    });

    test('Commands should exist', () => {
      const commands = [
        'play.js', 'stop.js', 'pause.js', 'resume.js',
        'skip.js', 'queue.js', 'nowplaying.js', 'volume.js', 'help.js'
      ];
      commands.forEach(cmd => {
        expect(fs.existsSync(`./src/commands/${cmd}`)).toBe(true);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('Validators', () => {
      const validators = require('../src/utils/validators');

      test('validateIntRange should accept valid numbers', () => {
        const result = validators.validateIntRange('50', 0, 100);
        expect(result.valid).toBe(true);
        expect(result.value).toBe(50);
      });

      test('validateIntRange should reject out-of-range numbers', () => {
        const result = validators.validateIntRange('150', 0, 100);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });

      test('validateString should accept valid strings', () => {
        const result = validators.validateString('hello world');
        expect(result.valid).toBe(true);
        expect(result.value).toBe('hello world');
      });

      test('validateString should reject empty strings', () => {
        const result = validators.validateString('');
        expect(result.valid).toBe(false);
      });

      test('sanitizeInput should remove dangerous characters', () => {
        const input = '<script>alert("xss")</script>';
        const sanitized = validators.sanitizeInput(input);
        expect(sanitized).not.toContain('<');
        expect(sanitized).not.toContain('>');
      });
    });

    describe('Embeds', () => {
      const embeds = require('../src/utils/embeds');

      test('createEmbed should return valid embed', () => {
        const embed = embeds.createEmbed('Test', 'Description', '#0099ff');
        expect(embed).toBeDefined();
        expect(embed.data.title).toBe('Test');
        expect(embed.data.description).toBe('Description');
      });

      test('createErrorEmbed should have error color', () => {
        const embed = embeds.createErrorEmbed('Error', 'Error message');
        expect(embed.data.color).toBe(parseInt('#FF0000', 16));
      });

      test('createSuccessEmbed should have success color', () => {
        const embed = embeds.createSuccessEmbed('Success', 'Success message');
        expect(embed.data.color).toBe(parseInt('#00AA00', 16));
      });

      test('createQueueEmbed should handle empty queue', () => {
        const embed = embeds.createQueueEmbed([]);
        expect(embed.data.title).toContain('Queue');
      });
    });
  });

  describe('Rate Limiter', () => {
    const rateLimiter = require('../src/middleware/rateLimiter');

    test('Should allow first command', () => {
      const mockMessage = { author: { id: 'user123', username: 'testuser' }, guild: { name: 'Test Guild' } };
      const result = rateLimiter.checkRateLimit(mockMessage);
      expect(result.allowed).toBe(true);
    });

    test('Should clear user cooldown', () => {
      const mockMessage = { author: { id: 'user456', username: 'testuser2' }, guild: { name: 'Test Guild' } };
      rateLimiter.checkRateLimit(mockMessage);
      rateLimiter.clearUserCooldown('user456');
      const result = rateLimiter.checkRateLimit(mockMessage);
      expect(result.allowed).toBe(true);
    });
  });
});

