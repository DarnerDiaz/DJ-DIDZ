#!/bin/bash
# Script para desplegar DJ DIDZ Bot en un VPS
# Uso: ./deploy-vps.sh <vps_ip> <vps_user>

set -e  # Exit on error

VPS_HOST="${1:-your-vps-ip}"
VPS_USER="${2:-ubuntu}"
APP_DIR="~/apps/dj-didz"
REPO_URL="https://github.com/DarnerDiaz/DJ-DIDZ.git"
BRANCH="main"

echo "🚀 Iniciando despliegue de DJ DIDZ..."
echo "📍 VPS: $VPS_USER@$VPS_HOST"
echo "📁 Directorio: $APP_DIR"
echo ""

# Función para ejecutar comandos en el VPS
run_remote() {
  ssh "$VPS_USER@$VPS_HOST" "$1"
}

# 1. Verificar conectividad SSH
echo "🔐 Verificando conectividad SSH..."
if ! ssh -o ConnectTimeout=5 "$VPS_USER@$VPS_HOST" "echo 'SSH OK'"; then
  echo "❌ No se puede conectar al VPS. Verifica la IP y credenciales SSH."
  exit 1
fi

# 2. Crear directorio de aplicación
echo "📁 Creando directorio de aplicación..."
run_remote "mkdir -p $APP_DIR && cd $APP_DIR"

# 3. Clonar o actualizar repositorio
echo "📥 Clonando/actualizando repositorio..."
run_remote "cd $APP_DIR && if [ -d .git ]; then git pull origin $BRANCH; else git clone -b $BRANCH $REPO_URL .; fi"

# 4. Crear archivo .env si no existe
echo "⚙️ Configurando variables de entorno..."
run_remote "cd $APP_DIR && if [ ! -f .env ]; then cat > .env << 'EOF'
DISCORD_TOKEN=your_token_here_change_this
NODE_ENV=production
DISCORD_PREFIX=-
LOG_LEVEL=info
EOF
  echo '⚠️ Recuerda actualizar DISCORD_TOKEN en .env'
fi"

# 5. Instalar Docker si no está presente
echo "🐳 Verificando Docker..."
if ! run_remote "command -v docker &> /dev/null"; then
  echo "📦 Instalando Docker..."
  run_remote "curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && rm get-docker.sh"
  run_remote "sudo usermod -aG docker $VPS_USER"
  echo "✅ Docker instalado"
else
  echo "✅ Docker ya está instalado"
fi

# 6. Instalar Docker Compose si no está presente
echo "🐳 Verificando Docker Compose..."
if ! run_remote "docker-compose --version &> /dev/null"; then
  echo "📦 Instalando Docker Compose..."
  run_remote "sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose"
  echo "✅ Docker Compose instalado"
else
  echo "✅ Docker Compose ya está instalado"
fi

# 7. Construir e iniciar con Docker Compose
echo "🔨 Construyendo imagen Docker..."
run_remote "cd $APP_DIR && docker-compose build"

echo "▶️ Iniciando contenedor..."
run_remote "cd $APP_DIR && docker-compose up -d"

# 8. Esperar a que el bot esté listo
echo "⏳ Esperando a que el bot esté listo..."
sleep 10

# 9. Verificar estado
echo "🔍 Verificando estado del bot..."
if run_remote "cd $APP_DIR && docker-compose ps | grep -q 'Up'"; then
  echo "✅ Bot está corriendo!"
  echo ""
  echo "📊 Estado de los servicios:"
  run_remote "cd $APP_DIR && docker-compose ps"
  echo ""
  echo "📝 Últimos logs:"
  run_remote "cd $APP_DIR && docker-compose logs --tail 20 dj-didz"
  echo ""
  echo "✨ Despliegue completado exitosamente!"
  echo ""
  echo "Comandos útiles:"
  echo "  Ver logs:       ssh $VPS_USER@$VPS_HOST 'cd $APP_DIR && docker-compose logs -f'"
  echo "  Detener:       ssh $VPS_USER@$VPS_HOST 'cd $APP_DIR && docker-compose down'"
  echo "  Reiniciar:     ssh $VPS_USER@$VPS_HOST 'cd $APP_DIR && docker-compose restart'"
  echo "  Actualizar:    ssh $VPS_USER@$VPS_HOST 'cd $APP_DIR && git pull && docker-compose up --build -d'"
else
  echo "❌ Error: El bot no está corriendo"
  echo "📝 Logs de error:"
  run_remote "cd $APP_DIR && docker-compose logs dj-didz"
  exit 1
fi
