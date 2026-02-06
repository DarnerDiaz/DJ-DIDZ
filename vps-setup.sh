#!/bin/bash
# Script para configurar un VPS nuevo desde cero
# Ejecutar esto ANTES del primer despliegue
# Uso: bash vps-setup.sh

echo "🔧 Configuración inicial del VPS para DJ DIDZ"
echo "==========================================="
echo ""

# Verificar si es root
if [ "$EUID" -ne 0 ]; then 
  echo "⚠️ Este script debe ejecutarse con sudo"
  echo "Uso: sudo bash vps-setup.sh"
  exit 1
fi

# 1. Actualizar sistema
echo "📦 Actualizando sistema..."
apt-get update && apt-get upgrade -y

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
apt-get install -y \
  curl \
  wget \
  git \
  build-essential \
  python3 \
  ffmpeg

# 3. Instalar Docker
echo "🐳 Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
bash get-docker.sh
rm get-docker.sh

# 4. Instalar Docker Compose
echo "🐳 Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 5. Crear usuario no-root para despliegue (opcional pero recomendado)
echo "👤 Creando usuario para despliegue..."
if ! id "deploy" &>/dev/null; then
  useradd -m -s /bin/bash deploy
  usermod -aG docker deploy
  mkdir -p /home/deploy/.ssh
  echo "✅ Usuario 'deploy' creado. Agrega tu public SSH key a /home/deploy/.ssh/authorized_keys"
fi

# 6. Crear directorio de aplicaciones
echo "📁 Creando directorio de aplicaciones..."
mkdir -p /home/deploy/apps/dj-didz
chown -R deploy:deploy /home/deploy/apps

# 7. Configurar firewall (UFW)
echo "🔒 Configurando firewall..."
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw --force enable

# 8. Instalar and configurar fail2ban
echo "🔐 Instalando fail2ban..."
apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# 9. Instalar Nginx como reverse proxy (opcional)
echo "🌐 Instalando Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# 10. Crear archivo de configuración de Nginx para health checks
echo "⚙️ Configurando Nginx..."
cat > /etc/nginx/sites-available/dj-didz << 'EOF'
server {
    listen 80;
    server_name _;

    location /health {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }

    location / {
        return 404;
    }
}
EOF

ln -sf /etc/nginx/sites-available/dj-didz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 11. Configurar logrotate para Docker
echo "📊 Configurando logrotate..."
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker

# 12. Mostrar información final
echo ""
echo "✅ Configuración completada!"
echo ""
echo "📊 Información del VPS:"
echo "  Docker version:       $(docker --version)"
echo "  Docker Compose:       $(docker-compose --version)"
echo "  Python:               $(python3 --version)"
echo "  FFmpeg:               $(ffmpeg -version | head -1)"
echo ""
echo "🚀 Próximos pasos:"
echo "  1. Configurar SSH en tu máquina local:"
echo "     ssh-copy-id deploy@$(hostname -I | awk '{print $1}')"
echo ""
echo "  2. Clonar el repositorio:"
echo "     ssh deploy@your-vps-ip"
echo "     cd ~/apps/dj-didz"
echo "     git clone <repo-url> ."
echo ""
echo "  3. Configurar .env:"
echo "     cp .env.example .env"
echo "     nano .env  # Editar DISCORD_TOKEN"
echo ""
echo "  4. Iniciar con Docker Compose:"
echo "     docker-compose up -d"
echo ""
echo "📝 Ubicaciones útiles:"
echo "  App directory:        /home/deploy/apps/dj-didz"
echo "  Docker config:        /etc/docker/daemon.json"
echo "  Nginx config:         /etc/nginx/sites-available/dj-didz"
echo "  Firewall status:      sudo ufw status"
echo ""
