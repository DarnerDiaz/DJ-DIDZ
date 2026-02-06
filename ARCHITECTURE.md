# DJ DIDZ - Arquitectura del Proyecto

## 🏗️ Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                            (Main Branch)                          │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                    Push Trigger (Webhook)
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
    ┌────▼──────────┐                   ┌───────▼────────┐
    │  GitHub       │                   │  Docker Hub    │
    │  Actions      │                   │  (Registry)    │
    │               │                   │                │
    │ 1. Test       │                   │ Image stores   │
    │ 2. Lint       │                   │ Multiple tags  │
    │ 3. Build      │                   └────────────────┘
    │ 4. Push       │
    │ 5. Deploy SSH │
    └────┬──────────┘
         │
    ┌────▼──────────────────────────────────────┐
    │            VPS / Production Server         │
    │  (DigitalOcean, AWS, Linode, etc.)       │
    │                                            │
    │  ┌──────────────────────────────┐         │
    │  │  Docker Container            │         │
    │  │  (dj-didz-bot)              │         │
    │  │                              │         │
    │  │  ┌──────────────────────┐    │         │
    │  │  │  Node.js Process     │    │         │
    │  │  │                      │    │         │
    │  │  │  • Discord.js Bot    │    │         │
    │  │  │  • DisTube Library   │    │         │
    │  │  │  • Music Streaming   │    │         │
    │  │  │  • Command Handler   │    │         │
    │  │  │  • Error Handling    │    │         │
    │  │  │  • Healthcheck       │    │         │
    │  │  │  • Heartbeat Writer  │    │         │
    │  │  └──────────────────────┘    │         │
    │  │                              │         │
    │  │  Volumes:                    │         │
    │  │  • /app/logs (persistent)    │         │
    │  │  • /app/.heartbeat           │         │
    │  │                              │         │
    │  └──────────────────────────────┘         │
    │           ▲                                │
    │           │ HEALTHCHECK                   │
    │           │ (every 30s)                   │
    │           │                               │
    │  ┌────────────────────────────────────┐   │
    │  │  Healthcheck Script                │   │
    │  │  (healthcheck.js)                  │   │
    │  │  ✓ Verifica .heartbeat file        │   │
    │  │  ✓ Timeout < 2 minutos             │   │
    │  └────────────────────────────────────┘   │
    │                                            │
    └────────────────────────────────────────────┘
         │                         │
         │                         │
    ┌────▼────────┐         ┌──────▼──────┐
    │   Discord   │         │   YouTube   │
    │   Servers   │         │   Spotify   │
    │ (Voice/Text)│         │   (Audio)   │
    └─────────────┘         └─────────────┘
```

## 📁 Estructura de Directorios

```
DJ-DIDZ/
│
├── 📄 index.js                      # Bot principal (250+ líneas)
├── 📄 healthcheck.js                # Health check para Docker
├── 📄 package.json                  # Dependencies & scripts
├── 📄 package-lock.json
│
├── 📚 Documentación
│   ├── README.md                    # Documentación principal
│   ├── DEPLOY.md                    # Guía de despliegue
│   ├── CONTRIBUTING.md              # Guía de contribución
│   ├── ARCHITECTURE.md              # Este archivo
│   └── .env.example                 # Plantilla de env
│
├── 🐳 Docker & DevOps
│   ├── Dockerfile                   # Multi-stage build
│   ├── docker-compose.yml           # Orquestación
│   └── .dockerignore                # Archivos excluidos
│
├── 🔧 Configuración
│   ├── .eslintrc.json              # Linting rules
│   ├── .gitignore                  # Git ignore
│   └── .github/
│       └── workflows/
│           └── ci-cd.yml           # GitHub Actions pipeline
│
├── 🧪 Tests
│   └── tests/
│       └── bot.test.js             # Test suite
│
├── 🚀 Scripts de Despliegue
│   ├── deploy-vps.sh               # Script deploy automático
│   └── vps-setup.sh                # Script setup inicial VPS
│
└── 📦 node_modules/                # Dependencies (gitignored)
```

## 🔄 Flujo de CI/CD

```
1. LOCAL DEVELOPMENT
   ├─ npm install
   ├─ npm run dev (watch mode)
   ├─ npm test (local tests)
   └─ npm run lint

2. GIT PUSH
   │
   └─> GitHub Webhook Trigger

3. GITHUB ACTIONS (Automated)
   │
   ├─ [Test Job]
   │  ├─ Checkout code
   │  ├─ Setup Node 18.x & 20.x
   │  ├─ Install deps
   │  ├─ Run ESLint
   │  ├─ Run tests
   │  └─ Upload coverage
   │
   ├─ [Build Job] (if tests pass)
   │  ├─ Setup Docker Buildx
   │  ├─ Login to Registry
   │  ├─ Build Docker image
   │  ├─ Tag image (latest, sha, semver)
   │  └─ Push to Registry
   │
   ├─ [Deploy Job] (if build passes)
   │  ├─ SSH to VPS
   │  ├─ Pull latest image
   │  ├─ Run docker-compose
   │  ├─ Verify deployment
   │  └─ Display logs
   │
   └─ [Notify Job]
      └─ Send status notification

4. PRODUCTION
   └─ Bot running on VPS + Discord
```

## 🔐 Variables de Entorno

```
Desarrollo:
  .env (local, NO commiteado)
  ├─ DISCORD_TOKEN=...
  ├─ NODE_ENV=development
  └─ LOG_LEVEL=debug

Producción (VPS):
  /home/deploy/apps/dj-didz/.env
  ├─ DISCORD_TOKEN=... (from GitHub Secrets)
  ├─ NODE_ENV=production
  └─ LOG_LEVEL=info

GitHub Actions Secrets:
  ├─ VPS_HOST
  ├─ VPS_USER
  ├─ VPS_SSH_KEY
  ├─ DISCORD_TOKEN
  ├─ DOCKER_USERNAME (optional)
  └─ DOCKER_PASSWORD (optional)
```

## 🔌 Integraciones Externas

```
┌─────────────────────┐
│   Discord.js API    │  ← Conexión web socket
│  (Gateway v10)      │  ← Streaming de eventos
└─────────────────────┘

┌─────────────────────┐
│   DisTube Library   │  ← Búsqueda de música
│  (YouTube/Spotify)  │  ← Gestión de cola
└─────────────────────┘

┌─────────────────────┐
│  FFmpeg (Binary)    │  ← Decodificación de audio
│  (Audio Codec)      │  ← Compresión Opus
└─────────────────────┘

┌─────────────────────┐
│  Docker Registry    │  ← Push/Pull imágenes
│  (Docker Hub)       │
└─────────────────────┘

┌─────────────────────┐
│  GitHub API         │  ← Webhooks & Actions
│  (Webhooks)         │  ← Secrets management
└─────────────────────┘
```

## 📊 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Runtime** | Node.js | 20.x |
| **Bot Framework** | discord.js | 14.x |
| **Music Streaming** | DisTube | 5.x |
| **Audio Processing** | FFmpeg | 5.x |
| **Containerization** | Docker | 24.x |
| **Orchestration** | Docker Compose | 3.8 |
| **CI/CD** | GitHub Actions | v4 |
| **Code Quality** | ESLint | Latest |
| **Testing** | Jest | Latest |
| **Package Manager** | npm | 10.x |

## 🔐 Seguridad

```
Local Development:
  ├─ .env file (gitignored)
  ├─ npm packages (lockfile)
  ├─ No sensitive data in code
  └─ ESLint validation

GitHub Actions:
  ├─ Secrets aus encrypted
  ├─ SSH keys injected at runtime
  ├─ No secrets in logs
  └─ Token rotation recommended

Docker Container:
  ├─ User: nodejs (non-root)
  ├─ Image: Alpine Linux (minimal)
  ├─ Multi-stage build (optimized)
  ├─ No hardcoded secrets
  └─ Security scanning ready

VPS:
  ├─ SSH key-based auth
  ├─ Firewall enabled (UFW)
  ├─ fail2ban protection
  ├─ Regular updates
  └─ Nginx reverse proxy
```

## 📈 Monitoreo y Logging

```
Local:
  └─ Console output

Docker:
  └─ Container logs → docker-compose logs -f

VPS:
  ├─ /home/deploy/apps/dj-didz/logs/
  ├─ docker logs dj-didz
  ├─ journalctl -u docker
  └─ Healthcheck status

GitHub Actions:
  └─ Actions tab → Workflow runs
```

## 🚀 Escalabilidad

### Versión Actual:
- ✅ Single bot instance
- ✅ Single shard (< 2500 guilds)
- ✅ Docker container

### Futuras Mejoras:
- 🔄 Bot sharding (multiple instances)
- 📊 Prometheus metrics
- 🔍 Elasticsearch logging
- 🚀 Kubernetes deployment (k8s)
- 💾 Redis caching
- 📈 Horizontal scaling

## 🔄 Proceso de Actualización

```
1. Developer hace cambios
2. Git push a branch
3. GitHub Actions runs tests
4. Si todo OK, build Docker image
5. Push a registry
6. SSH deploy a VPS
7. docker-compose pull + restart
8. Healthcheck verifica
9. Bot vuelve online
```

## 📚 Documentación Adicional

- **README.md** - Guía principal y quick start
- **DEPLOY.md** - Instrucciones detalladas de despliegue
- **CONTRIBUTING.md** - Cómo contribuir al proyecto
- **.github/workflows/ci-cd.yml** - Configuración detallada del pipeline
- **Dockerfile** - Comentarios sobre build process
- **docker-compose.yml** - Orquestación de servicios

---

**Versión:** 1.0.0  
**Última actualización:** 2024  
**Mantenedor:** Team DJ DIDZ
