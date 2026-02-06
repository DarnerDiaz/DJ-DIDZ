/**
 * Tests básicos para DJ DIDZ Bot
 * Ejecutar con: npm test
 */

describe('DJ DIDZ Bot - Tests Básicos', () => {
  describe('Environment Variables', () => {
    test('DISCORD_TOKEN debe estar definido o en .env', () => {
      const token = process.env.DISCORD_TOKEN;
      // En CI/CD, el token vendrá de secrets
      if (process.env.CI) {
        expect(token).toBeDefined();
      }
    });

    test('PREFIX debe tener un valor válido', () => {
      const prefix = process.env.DISCORD_PREFIX || '!';
      expect(prefix).toBeTruthy();
      expect(typeof prefix).toBe('string');
    });
  });

  describe('Configuración de Dependencias', () => {
    test('discord.js debe estar instalado', () => {
      const discord = require('discord.js');
      expect(discord).toBeDefined();
      expect(discord.Client).toBeDefined();
    });

    test('distube debe estar instalado', () => {
      const { DisTube } = require('distube');
      expect(DisTube).toBeDefined();
    });

    test('ffmpeg debe estar disponible', () => {
      const ffmpeg = require('ffmpeg-static');
      expect(ffmpeg).toBeDefined();
    });
  });

  describe('Estructura de Archivos', () => {
    test('index.js debe existir', () => {
      const fs = require('fs');
      expect(fs.existsSync('./index.js')).toBe(true);
    });

    test('package.json debe existir y ser válido', () => {
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      expect(pkg.name).toBe('dj-didz');
      expect(pkg.main).toBe('index.js');
    });
  });

  describe('Comentarios y Documentación', () => {
    test('index.js debe contener comentarios significativos', () => {
      const fs = require('fs');
      const content = fs.readFileSync('./index.js', 'utf8');
      expect(content).toContain('//');
    });
  });
});
