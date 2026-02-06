require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin({ 
    ytdlOptions: { 
      highWaterMark: 1 << 25,
      filter: 'audioonly',
      quality: 'highestaudio'
    } 
  })],
  emitNewSongOnly: true,
  ffmpeg: { path: ffmpeg }
});

// Utilidades
const PREFIX = process.env.DISCORD_PREFIX || '!';

const createEmbed = (title, description, color = '#0099ff') => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
};

const commands = {
  play: 'Reproduce una canción (ej: -play nombre canción)',
  stop: 'Detiene la música',
  pause: 'Pausa la canción actual',
  resume: 'Reanuda la canción pausado',
  skip: 'Salta a la siguiente canción',
  queue: 'Muestra la cola de reproducción',
  np: 'Muestra la canción que se está reproduciendo',
  volume: 'Cambia el volumen (ej: -volume 50)',
  help: 'Muestra esta ayuda'
};

// ==================== HEARTBEAT ====================
// Escribir archivo de latido cada 60 segundos para healthcheck
setInterval(() => {
  const heartbeatFile = path.join(__dirname, '.heartbeat');
  fs.writeFile(heartbeatFile, Date.now().toString(), (err) => {
    if (err) console.error('Error writing heartbeat:', err);
  });
}, 30000); // Actualizar cada 30 segundos

client.on('ready', () => {
  console.log(`✅ DJ DIDZ listo. Operando desde Arequipa para el mundo.`);
  client.user.setActivity('-help para comandos', { type: 'LISTENING' });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    switch (command) {
      case 'play': {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', '¡Brother, entra a un canal de voz!', '#FF0000')] });
        }
        
        const query = args.join(' ');
        if (!query) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'Dime qué canción quieres reproducir.', '#FF0000')] });
        }

        await distube.play(voiceChannel, query, {
          message,
          textChannel: message.channel,
          member: message.member
        });
        break;
      }

      case 'stop': {
        const queue = distube.getQueue(message);
        if (!queue) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'No hay música reproduciéndose.', '#FF0000')] });
        }
        distube.stop(message);
        message.reply({ embeds: [createEmbed('⏹️ Detenido', 'DJ DIDZ fuera.', '#00AA00')] });
        break;
      }

      case 'pause': {
        const queue = distube.getQueue(message);
        if (!queue) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'No hay música reproduciéndose.', '#FF0000')] });
        }
        if (queue.paused) {
          return message.reply({ embeds: [createEmbed('⚠️ Información', 'La música ya está pausada.', '#FFAA00')] });
        }
        queue.pause();
        message.reply({ embeds: [createEmbed('⏸️ Pausado', 'Música pausada.', '#FFAA00')] });
        break;
      }

      case 'resume': {
        const queue = distube.getQueue(message);
        if (!queue) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'No hay música reproduciéndose.', '#FF0000')] });
        }
        if (!queue.paused) {
          return message.reply({ embeds: [createEmbed('⚠️ Información', 'La música ya está reproduciéndose.', '#FFAA00')] });
        }
        queue.resume();
        message.reply({ embeds: [createEmbed('▶️ Reanudado', 'Música reanudada.', '#00AA00')] });
        break;
      }

      case 'skip': {
        const queue = distube.getQueue(message);
        if (!queue) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'No hay música reproduciéndose.', '#FF0000')] });
        }
        const currentSong = queue.songs[0];
        queue.skip();
        message.reply({ embeds: [createEmbed('⏭️ Saltado', `Se saltó: ${currentSong.name}`, '#00AA00')] });
        break;
      }

      case 'queue': {
        const queue = distube.getQueue(message);
        if (!queue || queue.songs.length === 0) {
          return message.reply({ embeds: [createEmbed('📋 Cola', 'La cola está vacía.', '#FFAA00')] });
        }
        
        const queueList = queue.songs
          .slice(0, 10)
          .map((song, i) => `${i + 1}. **${song.name}** (${song.formattedDuration})`)
          .join('\n');

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('📋 Cola de Reproducción')
          .setDescription(queueList)
          .setFooter({ text: `${queue.songs.length} canciones en cola` })
          .setTimestamp();

        message.reply({ embeds: [embed] });
        break;
      }

      case 'np': {
        const queue = distube.getQueue(message);
        if (!queue || !queue.songs[0]) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'No hay música reproduciéndose.', '#FF0000')] });
        }

        const song = queue.songs[0];
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('🎶 Reproduciendo Ahora')
          .setDescription(`**${song.name}**`)
          .addFields(
            { name: 'Duración', value: song.formattedDuration, inline: true },
            { name: 'Volumen', value: `${queue.volume}%`, inline: true }
          )
          .setTimestamp();

        message.reply({ embeds: [embed] });
        break;
      }

      case 'volume': {
        const queue = distube.getQueue(message);
        if (!queue) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'No hay música reproduciéndose.', '#FF0000')] });
        }

        const vol = parseInt(args[0]);
        if (isNaN(vol) || vol < 0 || vol > 100) {
          return message.reply({ embeds: [createEmbed('⚠️ Error', 'Usa un volumen entre 0 y 100.', '#FF0000')] });
        }

        queue.setVolume(vol);
        message.reply({ embeds: [createEmbed('🔊 Volumen', `Volumen ajustado a ${vol}%`, '#00AA00')] });
        break;
      }

      case 'help': {
        const helpText = Object.entries(commands)
          .map(([cmd, desc]) => `**!${cmd}** - ${desc}`)
          .join('\n');

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('📖 Comandos de DJ DIDZ')
          .setDescription(helpText)
          .setFooter({ text: 'DJ DIDZ v1.0.0 - Operando desde Arequipa' })
          .setTimestamp();

        message.reply({ embeds: [embed] });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error('Error en comando:', error);
    message.reply({ embeds: [createEmbed('❌ Error', 'Ocurrió un error procesando el comando.', '#FF0000')] });
  }
});

// Eventos de DisTube
distube.on('error', (channel, e) => {
  console.error('Error en DisTube:', e);
  
  const errorMsg = (e && e.message) ? e.message.slice(0, 100) : 'Fallo en el stream de YouTube';
  
  if (channel && typeof channel.send === 'function') {
    channel.send({ embeds: [createEmbed('❌ Error Técnico', errorMsg, '#FF0000')] });
  }
});

distube.on('playSong', (queue, song) => {
  const embed = new EmbedBuilder()
    .setColor('#00AA00')
    .setTitle('🎶 Reproduciendo Ahora')
    .setDescription(`**${song.name}**`)
    .addFields(
      { name: 'Duración', value: song.formattedDuration, inline: true },
      { name: 'Solicitado por', value: `${song.user || 'Desconocido'}`, inline: true }
    );
  
  queue.textChannel.send({ embeds: [embed] });
});

distube.on('addSong', (queue, song) => {
  const embed = new EmbedBuilder()
    .setColor('#FFAA00')
    .setDescription(`✅ **${song.name}** agregado a la cola.`);
  
  queue.textChannel.send({ embeds: [embed] });
});

distube.on('finish', (queue) => {
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setDescription('✅ Cola finalizada. ¡Gracias por escuchar a DJ DIDZ!');
  
  queue.textChannel.send({ embeds: [embed] });
});

client.login(process.env.DISCORD_TOKEN);