# DJ DIDZ - Advanced Discord Music Bot 🎶

Un bot de Discord profesional y completamente funcional para reproducir música con características avanzadas, manejo de errores robusto y despliegue automático con CI/CD.

## 📋 Características

✅ **Reproducción de Música**
- Integración con YouTube y Spotify
- Calidad de audio configurable
- Caché de canciones para mejor rendimiento

✅ **Comandos Completos**
- `-play <canción>` - Reproduce una canción
- `-stop` - Detiene la música
- `-pause` - Pausa la canción actual
- `-resume` - Reanuda la música
- `-skip` - Salta a la siguiente canción
- `-queue` - Muestra la cola de reproducción (máximo 10)
- `-np` - Muestra la canción actual
- `-volume <0-100>` - Ajusta el volumen
- `-help` - Muestra ayuda sobre los comandos

✅ **Características de Producción**
- Manejo robusto de errores
- Embeds Discord elegantes y profesionales
- Healthcheck integrado
- Logging estructurado
- Seguridad: usuario no-root en Docker

✅ **CI/CD y DevOps**
- Pipeline automático con GitHub Actions
- Linting y tests automáticos
- Build y push a Docker Hub
- Despliegue automático a VPS

## 🚀 Inicio Rápido

### Requisitos
- Node.js 20+
- FFmpeg instalado
- Token de Discord Bot

### Instalación Local

```bash
# Clonar repositorio
git clone <your-repo-url>
cd DJ-DIDZ

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env y agregar tu DISCORD_TOKEN
```

### Variables de Entorno (`.env`)
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_PREFIX=-
NODE_ENV=production
```

### Ejecutar el Bot

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start

# Ejecutar tests
npm test

# Linting
npm run lint
npm run lint:fix
```

## 🐳 Docker

### Build y Run con Docker

```bash
# Build de la imagen
docker build -t dj-didz:latest .

# Run de un contenedor
docker run \
  -e DISCORD_TOKEN=your_token_here \
  -e NODE_ENV=production \
  --name dj-didz \
  dj-didz:latest
```

### Docker Compose (Recomendado)

```bash
# Crear .env con tus credenciales
echo "DISCORD_TOKEN=your_token_here" > .env

# Iniciar servicio
docker-compose up -d

# Ver logs
docker-compose logs -f dj-didz

# Detener servicio
docker-compose down
```

## 🔄 CI/CD con GitHub Actions

El proyecto incluye un pipeline automático que:

1. **Valida el código** - Ejecuta linting y tests
2. **Construye imagen Docker** - Multi-stage build optimizado
3. **Push a Docker Hub** - Si está configurado
4. **Despliega a VPS** - Via SSH (opcional)

### Configuración de Secrets en GitHub

En tu repositorio, ve a `Settings → Secrets and variables → Actions` y agrega:

```
DOCKER_USERNAME     - Tu usuario de Docker Hub
DOCKER_PASSWORD     - Tu token de Docker Hub
VPS_HOST           - IP o dominio del VPS
VPS_USER           - Usuario SSH del VPS
VPS_SSH_KEY        - Private key SSH (id_rsa)
DISCORD_TOKEN      - Token del bot de Discord
```

### Ver Workflows

```bash
# Los workflows se ejecutan automáticamente en:
# - Push a main/master
# - Pull requests
# - Manualmente desde Actions tab
```

## 📊 Estructura del Proyecto

```
.
├── index.js                    # Código principal del bot
├── healthcheck.js              # Script de salud del contenedor
├── package.json                # Dependencias y scripts
├── Dockerfile                  # Imagen Docker multi-stage
├── docker-compose.yml          # Orquestación con Docker Compose
├── .env.example                # Plantilla de variables de entorno
├── .eslintrc.json             # Configuración de linting
├── .dockerignore               # Archivos a excluir de Docker
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline de GitHub Actions
├── tests/
│   └── bot.test.js            # Tests automáticos
└── README.md                   # Este archivo
```

## 🧪 Testing

El proyecto incluye tests para:
- Validar variables de entorno
- Verificar instalación de dependencias
- Confirmar estructura de archivos
- Documentación del código

```bash
npm test              # Ejecutar tests una sola vez
npm run test:watch   # Ejecutar tests con auto-reload
```

## 🚢 Despliegue en VPS (DigitalOcean / AWS)

### Opción 1: Usando Docker Compose en el VPS

```bash
# En tu VPS
# 1. Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 2. Clonar repositorio
git clone <your-repo-url>
cd DJ-DIDZ

# 3. Configurar variables
cp .env.example .env
nano .env  # Editar con tu token

# 4. Iniciar con Docker Compose
docker-compose up -d

# 5. Ver logs
docker-compose logs -f dj-didz

# 6. Reiniciar si es necesario
docker-compose restart dj-didz
```

### Opción 2: Despliegue Automático con GitHub Actions

El workflow automático puede desplegar en tu VPS:

```yaml
# En .github/workflows/ci-cd.yml (ya configurado)
# El deploy se ejecuta automáticamente después de pasar los tests
```

**Primer setup en VPS:**
```bash
# SSH en tu VPS
ssh user@your-vps-ip

# Crear directorio de despliegue
mkdir -p ~/apps/dj-didz
cd ~/apps/dj-didz

# Crear archivo .env
nano .env
# Agregar: DISCORD_TOKEN=your_token

# Crear docker-compose.yml
wget https://raw.githubusercontent.com/your-user/DJ-DIDZ/main/docker-compose.yml

# Iniciar
docker-compose up -d
```

## 📈 Monitoreo

### Healthcheck
El bot incluye verificación de salud automática:
```bash
node healthcheck.js  # Verifica si el bot está vivo
docker-compose logs  # Ver logs del contenedor
```

### Datos Persistentes (Opcional)
Para mantener logs persistentes:

```bash
# El docker-compose.yml ya incluye:
volumes:
  - ./logs:/app/logs
```

## 🔐 Seguridad

✅ Variable `DISCORD_TOKEN` es sensible (nunca en git)  
✅ Usuario no-root en Docker (por defecto)  
✅ Validación de entrada en comandos  
✅ Manejo seguro de errores (no expone stack traces)  
✅ SSH keys para despliegue automático  

## 🛠️ Troubleshooting

### Bot no responde
```bash
# Verificar token
docker-compose logs dj-didz

# Reiniciar
docker-compose restart dj-didz

# Reconstruir imagen
docker-compose up --build dj-didz
```

### Error de FFmpeg
```bash
# Asegurar que está instalado
# En local: sudo apt-get install ffmpeg (Linux) o brew install ffmpeg (Mac)
# En Docker: Ya está incluido en la imagen
```

### Contenedor se detiene
```bash
# Ver logs detallados
docker-compose logs --tail 100 dj-didz

# Verificar healthcheck
docker-compose ps
```

## 📚 Recursos

- [Discord.js Docs](https://discord.js.org)
- [DisTube Docs](https://distube.js.org)
- [Docker Compose Docs](https://docs.docker.com/compose)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 📄 Licencia

ISC

## 👨‍💻 Autor

DJ DIDZ - Discord Music Bot - 2024

---

**¿Preguntas?** Abre un issue en GitHub.  
**¿Mejoras?** Pull requests bienvenidos.
