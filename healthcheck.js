/**
 * Healthcheck script para verificar si el bot está operativo
 * Usado por Docker HEALTHCHECK
 */

const fs = require('fs');
const path = require('path');

// Crear archivo de latido si no existe
const heartbeatFile = path.join(__dirname, '.heartbeat');

try {
  // Verificar si el archivo de latido fue actualizado hace menos de 2 minutos
  if (fs.existsSync(heartbeatFile)) {
    const stats = fs.statSync(heartbeatFile);
    const lastModified = stats.mtimeMs;
    const now = Date.now();
    const diff = now - lastModified;

    if (diff < 120000) { // 2 minutos
      console.error('✅ Bot healthy');
      process.exit(0);
    } else {
      console.error('❌ Bot heartbeat stale');
      process.exit(1);
    }
  } else {
    console.error('❌ Heartbeat file not found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Healthcheck error:', error.message);
  process.exit(1);
}
