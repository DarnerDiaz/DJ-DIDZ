# Contribuyendo a DJ DIDZ

¡Gracias por tu interés en contribuir! Este documento proporciona directrices y instrucciones para contribuir.

## Código de Conducta

Sé respetuoso y profesional. Incluye a todos en la comunidad.

## Cómo Contribuir

### Reportar Bugs

1. **Usa GitHub Issues** para reportar bugs
2. **Incluye detalles:**
   - Descripción clara del bug
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Logs relevantes
   - Versión de Node.js, Docker, etc.

### Sugerir Mejoras

1. **Abre una Discussion o Issue** con tag `enhancement`
2. **Describe claramente:**
   - El problema que resuelve
   - Cómo funcionaría
   - Ejemplos de uso

### Enviar Pull Requests

1. **Fork** el repositorio
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

3. **Haz cambios** manteniendo:
   - Estilo de código consistente
   - Comentarios claros
   - Tests actualizados

4. **Ejecuta validaciones:**
   ```bash
   npm run lint
   npm run lint:fix
   npm test
   ```

5. **Commit** con mensajes claros:
   ```bash
   git commit -m "feat: agregar nuevo comando de lyrics"
   git commit -m "fix: resolver error de conexión"
   git commit -m "docs: mejorar documentación de deploy"
   ```

6. **Push y abre PR** usando la plantilla

## Estándar de Código

- **Node.js 20+** requerido
- **ESLint** para linting
- **Jest** para tests
- **Documentación** en comentarios y README

### Guía de Estilo

```javascript
// ✅ Bueno
const bot = new Discord.Client({
  intents: [GatewayIntentBits.Guilds]
});

// ❌ Malo
const bot=new Discord.Client({intents:[GatewayIntentBits.Guilds]})

// ✅ Comentarios útiles
// Conectar al servidor de Discord
client.login(token);

// ❌ Comentarios innecesarios
result = result + 1; // sumar 1 a result
```

## Estructura de Features

```
feature/
├── Nueva funcionalidad en index.js
├── Tests en tests/
├── Documentación actualizada en README.md
└── Commits atómicos y descriptivos
```

## Proceso de Review

1. ✅ Tests automáticos deben pasar
2. ✅ ESLint debe pasar sin errores
3. ✅ Al menos un mantainer revisa el código
4. ✅ Se fusiona con la rama principal

## Configuración de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar en modo watch
npm run dev

# Tests
npm test
npm run test:watch

# Linting
npm run lint
npm run lint:fix
```

## Despliegue de Cambios

Los cambios en `main` se despliegan automáticamente mediante GitHub Actions a:

1. Docker Hub (imagen)
2. VPS (si está configurado)
3. Staging (opcional)

## Preguntas?

- 💬 Abre una **Discussion** para preguntas
- 🐛 Reporta **Bugs** con Issues
- 📝 Crea **Pull Requests** para código
- 📚 Consulta la **Documentación**

---

**¡Gracias por contribuir a DJ DIDZ! 🎵**
