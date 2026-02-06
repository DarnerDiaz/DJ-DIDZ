# DJ DIDZ - Guía de Despliegue en VPS

## 📋 Requisitos Previos

- VPS con Ubuntu 20.04+ (DigitalOcean, AWS, Linode, etc.)
- Acceso SSH con par de claves (no contraseña)
- Token de Discord Bot
- Cuenta en Docker Hub (opcional, para imágenes personalizadas)

## 🚀 Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

### Paso 1: Preparar el VPS

```bash
# 1. SSH en tu VPS
ssh root@your-vps-ip

# 2. Ejecutar script de configuración inicial
curl -fsSL https://raw.githubusercontent.com/your-username/DJ-DIDZ/main/vps-setup.sh | sudo bash

# 3. Cambiar a usuario deploy
su - deploy
```

### Paso 2: Configurar Secrets en GitHub

1. Ir a: **Settings → Secrets and variables → Actions**
2. Crear los siguientes secrets:

```
VPS_HOST          = your-vps-ip-or-domain
VPS_USER          = deploy
VPS_SSH_KEY       = (contenido de ~/.ssh/id_rsa privada)
DISCORD_TOKEN     = (tu token de bot)
```

### Paso 3: Primer Despliegue Manual

Una vez configurados los secrets, el siguiente push a `main` lo desplegará automáticamente.

```bash
# En tu máquina local
git add .
git commit -m "feat: configure CI/CD pipeline"
git push origin main
```

Ver estado en: **GitHub → Actions**

## 🚀 Opción 2: Despliegue Manual Rápido

Si prefieres desplegar sin GitHub Actions:

```bash
# En tu máquina local, ejecutar script de despliegue
chmod +x deploy-vps.sh
./deploy-vps.sh your-vps-ip deploy
```

## 🔧 Configuración Manual Paso a Paso

Si necesitas hacerlo manualmente:

```bash
# 1. SSH al VPS
ssh deploy@your-vps-ip

# 2. Crear directorio
mkdir -p ~/apps/dj-didz
cd ~/apps/dj-didz

# 3. Clonar repositorio (si lo tienes en un repo público)
git clone https://github.com/your-username/DJ-DIDZ.git .

# 4. Crear archivo .env
cat > .env << EOF
DISCORD_TOKEN=your_actual_token_here
NODE_ENV=production
DISCORD_PREFIX=-
EOF

# 5. Iniciar con Docker Compose
docker-compose up -d

# 6. Ver logs
docker-compose logs -f dj-didz
```

## 🔐 Configurar GitHub Deploy Keys (Repos Privados)

Si tu repo es privado:

```bash
# En el VPS
ssh-keygen -t ed25519 -C "deploy@dj-didz"

# Ver la clave pública
cat ~/.ssh/id_ed25519.pub

# En GitHub, agregar como Deploy Key:
# Settings → Deploy keys → Add deploy key
# Marcar "Allow write access"
```

## 📊 Verificar que Todo Funciona

```bash
# En el VPS
docker-compose ps

# Ver logs en vivo
docker-compose logs -f dj-didz

# Probar healthcheck
curl localhost:8080/health

# Ver información del contenedor
docker stats dj-didz
```

## 🔄 Actualizaciones Posteriores

### Actualizar el código

```bash
# En el VPS
cd ~/apps/dj-didz
git pull origin main
docker-compose up --build -d
```

### O en local + push (con GitHub Actions)

```bash
# En tu máquina local
git add .
git commit -m "feat: nueva feature"
git push origin main

# GitHub Actions se encarga del despliegue automáticamente
```

## 🛟 Troubleshooting

### El contenedor no inicia

```bash
# Verificar logs
docker-compose logs dj-didz

# Verificar logs del sistema
journalctl -u docker -n 50

# Reintentar
docker-compose restart dj-didz
```

### Error: "DISCORD_TOKEN is not defined"

```bash
# Verificar archivo .env
cat .env

# Recrear si es necesario
nano .env
# Agregar DISCORD_TOKEN=tu_token_real
```

### Error: "FFmpeg not found"

```bash
# Instalar ffmpeg en el VPS
sudo apt-get update
sudo apt-get install -y ffmpeg

# Reconstruir imagen Docker
docker-compose build --no-cache
docker-compose up -d
```

### Bot sale offline después de X tiempo

```bash
# Verificar healthcheck
docker inspect dj-didz | grep -A 5 Healthcheck

# Ver logs detallados
docker-compose logs --tail 100 dj-didz

# Si es necesario, reiniciar
docker-compose restart dj-didz
```

## 📈 Monitoreo

### Setup de monitoreo básico

```bash
# En el VPS, crear archivo de log
mkdir -p ~/apps/dj-didz/logs

# Ver tamaño de logs
du -sh ~/apps/dj-didz/logs

# Limpiar logs viejos
find ~/apps/dj-didz/logs -type f -mtime +7 -delete
```

### Dashboard básico (opcional)

```bash
# Instalar Portainer (UI para Docker)
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Acceder a: `http://your-vps-ip:9000`

## 🔒 Seguridad

- ✅ Usar SSH keys (no contraseña)
- ✅ Firewall habilitado (UFW)
- ✅ Usuario no-root para Docker
- ✅ Tokens almacenados en GitHub Secrets
- ✅ .env nunca commiteado
- ✅ Logs rotados automáticamente

## 📋 Checklist de Despliegue

- [ ] VPS completamente actualizado
- [ ] SSH keys configuradas
- [ ] Docker instalado
- [ ] GitHub secrets configurados
- [ ] .env en el VPS con DISCORD_TOKEN real
- [ ] docker-compose.yml en el VPS
- [ ] Primera ejecución sin errores
- [ ] Logs monitoreados
- [ ] Backup de .env creado

## 🆘 Soporte

- 📚 Docs de Docker: https://docs.docker.com
- 📚 Docs de GitHub Actions: https://docs.github.com/en/actions
- 💬 Issues: https://github.com/your-username/DJ-DIDZ/issues
- 🐛 Bugs: Incluir logs y detalles del VPS

---

**¿Necesitas ayuda?** Abre un issue en GitHub con detalles de tu error.
