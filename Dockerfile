# Multi-stage build for optimized image
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias de compilación necesarias para módulos nativos
RUN apk add --no-cache python3 make g++ ffmpeg

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar solo ffmpeg en la imagen final
RUN apk add --no-cache ffmpeg

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copiar node_modules de la etapa builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar código fuente
COPY --chown=nodejs:nodejs . .

# Cambiar a usuario no-root
USER nodejs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# Ejecutar la aplicación
CMD ["npm", "start"]
