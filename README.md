<!-- Header con ASCII Art -->
<div align="center">

```
  ██████╗ ██╗       ██████╗ ██╗██████╗ ███████╗
  ██╔══██╗██║       ██╔══██╗██║██╔══██╗██╔════╝
  ██║  ██║██║       ██║  ██║██║██║  ██║███████╗
  ██║  ██║██║       ██║  ██║██║██║  ██║╚════██║
  ██████╔╝███████╗  ██████╔╝██║██████╔╝███████║
  ╚═════╝ ╚══════╝  ╚═════╝ ╚═╝╚═════╝ ╚══════╝
                                           
          🎶 Advanced Discord Music Bot
```

**Professional • Modular • Production-Ready**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.25-purple.svg)](https://discord.js.org/)
[![Test Coverage](https://img.shields.io/badge/Tests-Jest-red.svg)](https://jestjs.io/)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

[🎯 Features](#-features) • [🚀 Quick Start](#-quick-start) • [📚 Documentation](#-documentation) • [🐳 Docker](#-docker) • [🆘 Support](#-support)

</div>

---

## 🎯 Features

<table>
<tr>
<td width="50%">

### 🎵 Music Playback
- ▶️ YouTube & Spotify integration
- 🎚️ Quality configuration
- 💾 Smart caching
- 📋 Queue management
- 🔊 Volume control

### 🛡️ Security & Stability
- ⚡ Rate limiting
- ✅ Input validation
- 🔐 XSS prevention
- 📊 Error tracking
- 🏥 Health checks

</td>
<td width="50%">

### 🏗️ Architecture
- 🧩 Modular design
- 📦 20+ modules
- 🧪 Jest tests
- 📝 Full JSDoc
- ✨ ESLint compliant

### 🚀 DevOps
- 🐳 Docker ready
- 🔄 CI/CD pipeline
- 📈 Winston logging
- 🌍 Multi-platform
- 💾 Data persistence

</td>
</tr>
</table>

---

## 📋 Commands

| Command | Alias | Description | Example |
|---------|-------|-------------|---------|
| **play** | `p` | 🎵 Play a song | `-play lo-fi beats` |
| **stop** | `s` | ⏹️ Stop playback | `-stop` |
| **pause** | `pa` | ⏸️ Pause current | `-pause` |
| **resume** | `res` | ▶️ Resume music | `-resume` |
| **skip** | `sk` | ⏭️ Skip to next | `-skip` |
| **queue** | `q` | 📋 Show queue | `-queue 1` |
| **nowplaying** | `np` | 🎶 Current song | `-np` |
| **volume** | `vol` | 🔊 Set volume | `-volume 75` |
| **help** | `?` | ❓ Show commands | `-help` |

---

## 🚀 Quick Start

### 📋 Prerequisites

```bash
✅ Node.js 18+ (20+ recommended)
✅ FFmpeg installed
✅ Discord Bot Token (from Discord Developer Portal)
✅ Git (optional, for cloning)
```

**Get your Discord Bot Token:**
1. Visit [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Go to "Bot" → Create Bot
4. Copy the token
5. Enable "Message Content Intent"

### ⚡ Installation

```bash
# 1️⃣  Clone the repository
git clone https://github.com/yourusername/dj-didz.git
cd dj-didz

# 2️⃣  Install dependencies
npm install

# 3️⃣  Create environment file
cp .env.example .env

# 4️⃣  Edit .env with your token
# DISCORD_TOKEN=your_token_here
```

### 🎮 Running the Bot

```bash
# 🔧 Development (with auto-reload)
npm run dev

# 📦 Production
npm start

# 🧪 Run tests
npm test

# 🔍 Check code quality
npm run lint
npm run lint:fix
```

### ⚙️ Configuration (`.env`)

```env
# 🔴 REQUIRED
DISCORD_TOKEN=your_bot_token_here

# 🟢 OPTIONAL (defaults provided)
DISCORD_PREFIX=-                      # Command prefix
BOT_NAME=DJ DIDZ                      # Bot display name
NODE_ENV=development                  # development|production
LOG_LEVEL=info                        # debug|info|warn|error
RATE_LIMIT_ENABLED=true               # Enable rate limiting
RATE_LIMIT_MAX_COMMANDS=5             # Max commands per window
RATE_LIMIT_WINDOW_MS=10000            # Window in milliseconds
DEFAULT_VOLUME=50                     # Default volume (0-100)
```

---

## 📁 Project Structure

```
dj-didz/
│
├── 🎯 Core
│   ├── index.js                    # Main entry point
│   └── healthcheck.js              # Health monitoring
│
├── 📂 src/
│   ├── commands/                   # 9 music commands
│   │   ├── Command.js              # Base class
│   │   ├── play.js, stop.js, ...   # Command modules
│   │   └── loader.js               # Dynamic loader
│   │
│   ├── events/                     # Event handlers
│   │   ├── client.js               # Discord events
│   │   └── distube.js              # Music events
│   │
│   ├── middleware/
│   │   └── rateLimiter.js          # Rate limiting
│   │
│   ├── utils/                      # Utilities
│   │   ├── logger.js               # Winston logging 📊
│   │   ├── embeds.js               # Discord embeds 🎨
│   │   ├── validators.js           # Input validation ✅
│   │   └── database.js             # Data persistence 💾
│   │
│   └── config/
│       └── index.js                # Centralized config ⚙️
│
├── 🧪 tests/
│   └── bot.test.js                 # Jest test suite
│
├── 🐳 Docker
│   ├── Dockerfile                  # Multi-stage build
│   └── docker-compose.yml          # Container orchestration
│
├── 📋 Logs & Data
│   ├── logs/                       # Application logs 📝
│   └── data/                       # User data 💾
│
└── ⚙️ Configuration
    ├── .env.example                # Environment template
    ├── .eslintrc.json             # Code quality rules
    ├── .gitignore                 # Git ignore rules
    └── package.json               # Dependencies
```

---

## 🏗️ Architecture

### From Monolith to Modular ⚡

**Before (v1.0)**: Monolithic 250-line single file  
**After (v2.0)**: 20+ modular files with clear separation of concerns

```
Command Execution Flow:
┌─────────────┐
│ Message     │
│ Received    │
└──────┬──────┘
       ↓
┌──────────────────────┐
│ Rate Limiter Check   │ ⚡ Prevent spam
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Parse Command        │ 📝 Extract args
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Command Loader       │ 🔍 Find command
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Validation           │ ✅ Input check
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Execute Handler      │ 🎵 Run command
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Error Handling       │ 🛡️ Safe recovery
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Logging              │ 📊 Track event
└──────────────────────┘
```

---

## 🐳 Docker & Deployment

### 🚀 Docker Compose (Recommended)

```bash
# 1️⃣  Start the bot
docker-compose up -d

# 2️⃣  View logs
docker-compose logs -f dj-didz

# 3️⃣  Stop the bot
docker-compose down

# 4️⃣  Restart
docker-compose restart dj-didz

# 5️⃣  Rebuild after code changes
docker-compose up --build -d
```

### 🏗️ Manual Docker Build

```bash
# Build image
docker build -t dj-didz:latest .

# Run container
docker run -d \
  --name dj-didz \
  -e DISCORD_TOKEN=your_token \
  -e NODE_ENV=production \
  dj-didz:latest

# View logs
docker logs -f dj-didz

# Stop container
docker stop dj-didz
docker rm dj-didz
```

### 📊 Health Status

```bash
# Check if healthy
docker ps

# Should show STATUS: Up X seconds (healthy)
docker-compose ps

# Manual healthcheck
node healthcheck.js
```

---

## 🔄 CI/CD Pipeline

### ✅ Automated Workflow

The repository includes GitHub Actions that automatically:

```
┌─────────────┐
│ Push Code   │
└──────┬──────┘
       ↓
┌─────────────────────────────┐
│ 1️⃣  Run ESLint              │ Code quality check
└──────┬──────────────────────┘
       ↓
┌─────────────────────────────┐
│ 2️⃣  Run Jest Tests          │ 20+ test cases
└──────┬──────────────────────┘
       ↓
┌─────────────────────────────┐
│ 3️⃣  Build Docker Image      │ Multi-stage build
└──────┬──────────────────────┘
       ↓
┌─────────────────────────────┐
│ 4️⃣  Push to Registry        │ Docker Hub/GHCR
└──────┬──────────────────────┘
       ↓
┌─────────────────────────────┐
│ 5️⃣  Deploy to VPS (optional)│ SSH deployment
└─────────────────────────────┘
```

### 🔐 GitHub Secrets Setup

Go to **Settings → Secrets and variables → Actions** and add:

```
🔑 DISCORD_TOKEN          → Your bot token
🐳 DOCKER_HUB_USERNAME    → Docker Hub username
🐳 DOCKER_HUB_TOKEN       → Docker Hub token
🖥️  VPS_HOST              → VPS IP/domain
👤 VPS_USER               → SSH username
🔑 VPS_SSH_KEY            → Private SSH key
```

---

## 📊 Logging & Monitoring

### 📝 Log Levels

```javascript
logger.error('Critical error')   // 🔴 Errors only
logger.warn('Warning message')   // 🟡 Warnings
logger.info('Info message')      // 🟢 General info
logger.debug('Debug info')       // 🔵 Detailed debug
```

### 📂 Log Files

```
logs/
├── bot.log          # All logs (rotating)
├── error.log        # Errors only
└── 2024-03-18.log   # Daily rotation
```

### 👀 View Logs

```bash
# Docker logs
docker-compose logs -f dj-didz

# Local logs
tail -f logs/bot.log

# Last 100 lines
tail -100 logs/bot.log
```

---

## 🧪 Testing

### ✅ Test Coverage

```bash
# Run all tests
npm test

# Watch mode (auto-reload)
npm run test:watch

# With coverage report
npm test -- --coverage
```

### 📋 Test Categories

- ✅ Configuration validation
- ✅ Dependency checks
- ✅ Utility functions
- ✅ Project structure
- ✅ Command loading
- ✅ Rate limiter
- ✅ Input validators

---

## 🆘 Troubleshooting

### ❓ Common Issues

#### Bot doesn't respond
```bash
# 1. Check token
echo $DISCORD_TOKEN

# 2. Verify running
docker-compose ps

# 3. Check logs
docker-compose logs dj-didz

# 4. Restart
docker-compose restart dj-didz
```

#### FFmpeg not found
```bash
# Linux
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
choco install ffmpeg
# Or download: https://ffmpeg.org/download.html
```

#### Port already in use
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port in docker-compose.yml
```

#### Container crashes
```bash
# View detailed logs
docker-compose logs --tail 50 dj-didz

# Check environment variables
docker-compose config

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| 📖 [README.md](README.md) | This file - Overview & quick start |
| 🔄 [CHANGELOG.md](CHANGELOG.md) | Version history & changes |
| 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) | Detailed architecture docs |
| 🚀 [GITHUB-SETUP.md](GITHUB-SETUP.md) | GitHub integration guide |
| 📝 [REFACTOR-SUMMARY.md](REFACTOR-SUMMARY.md) | v2.0.0 improvements |

---

## 🔗 Useful Links

### 📚 Documentation
- [Discord.js Official Docs](https://discord.js.org)
- [DisTube Documentation](https://distube.js.org)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [Docker Documentation](https://docs.docker.com)

### 🛠️ Tools
- [Discord Developer Portal](https://discord.com/developers/applications)
- [FFmpeg Installation](https://ffmpeg.org/download.html)
- [Node Version Manager](https://github.com/nvm-sh/nvm)

### 💬 Community
- [Discord.js Server](https://discord.gg/djs)
- [DisTube Issues](https://github.com/skick1234/DisTube/issues)
- [Node.js Community](https://nodejs.org/en/community/)

---

## 🤝 Contributing

### 💡 How to Contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Code** your changes with proper formatting
4. **Test** with: `npm test && npm run lint`
5. **Commit**: `git commit -m 'feat: add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Pull Request** → main branch

### 📋 Contributing Guidelines

- ✅ Follow ESLint rules
- ✅ Write tests for new features
- ✅ Update documentation
- ✅ Use meaningful commit messages
- ✅ Keep code modular

---

## 📈 Performance

### 🚀 Optimizations Included

| Feature | Benefit |
|---------|---------|
| Event-driven architecture | ⚡ Low CPU usage |
| Command caching | 💨 Fast execution |
| Connection pooling | 📊 Efficient resources |
| Error recovery | 🛡️ Stability |
| Memory management | 💾 Stable memory |

---

## 📜 License

```
ISC License

Copyright (c) 2024 DJ DIDZ

Permission to use, copy, modify, and/or distribute this software
for any purpose with or without fee is hereby granted.
```

---

## 🎉 Credits & Acknowledgments

### 🙏 Built With

- **[discord.js](https://discord.js.org)** - Discord API library
- **[DisTube](https://distube.js.org)** - Music streaming library
- **[Winston](https://github.com/winstonjs/winston)** - Logging framework
- **[Jest](https://jestjs.io/)** - Testing framework
- **[ESLint](https://eslint.org/)** - Code quality

### 👨‍💻 Author

**DJ DIDZ Development Team**  
🌍 Operating from Arequipa, Peru  
📧 For inquiries: [Create an issue](https://github.com/yourusername/dj-didz/issues)

---

<div align="center">

### ⭐ If you find this useful, please star it! ⭐

[🔝 Back to Top](#-features)

**Made with ❤️ for the Discord community**

</div>
