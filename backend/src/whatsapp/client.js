const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Clean WhatsApp session if RESET_SESSION=true
if (process.env.RESET_SESSION === 'true') {
  const sessionPath = path.join(__dirname, '../../.wwebjs_auth');
  console.log('🗑️  RESET_SESSION=true detected');
  console.log(`🗑️  Cleaning WhatsApp session folder: ${sessionPath}`);

  try {
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
      console.log('✅ Session folder deleted successfully');
    } else {
      console.log('ℹ️  Session folder does not exist (already clean)');
    }
  } catch (error) {
    console.error('❌ Error cleaning session folder:', error);
  }

  console.log('⚠️  Remember to remove RESET_SESSION variable after successful QR scan!\n');
}

// Configuración de Puppeteer para Railway
const puppeteerConfig = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ]
};

// Usar Chromium en producción (Railway/Docker)
if (process.env.NODE_ENV === 'production') {
  puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: puppeteerConfig
});

client.on('qr', async (qr) => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 SCAN QR CODE WITH YOUR WHATSAPP');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // QR en terminal (puede verse mal en Railway logs)
  qrcodeTerminal.generate(qr, { small: true });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 ALTERNATIVE: Scan this QR from your browser:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Generar URL usando servicio público de QR
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
  console.log(`   ${qrUrl}`);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Instructions:');
  console.log('   1. Copy the URL above');
  console.log('   2. Open it in your browser');
  console.log('   3. Scan the QR with WhatsApp on your phone');
  console.log('   4. WhatsApp → Menu → Linked Devices → Link a Device');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // También generar como Data URL (base64)
  try {
    const qrDataUrl = await QRCode.toDataURL(qr);
    console.log('📊 QR as Data URL (paste in browser):');
    console.log(`   ${qrDataUrl.substring(0, 100)}...`);
    console.log('   (Full URL is too long to display)\n');
  } catch (err) {
    console.error('Error generating Data URL:', err);
  }
});

client.on('ready', async () => {
  console.log('✅ WhatsApp bot is ready!');
  console.log('🎯 Bot is now listening for messages...');

  // Log session info
  try {
    const info = client.info;
    if (info) {
      console.log(`📱 Connected as: ${info.pushname} (${info.wid.user})`);
      console.log(`📱 Platform: ${info.platform}`);
    }

    // Check if client can receive messages
    const state = await client.getState();
    console.log(`🔌 Connection state: ${state}`);

    if (state !== 'CONNECTED') {
      console.warn(`⚠️  WARNING: State is ${state}, not CONNECTED. This may cause message reception issues.`);
    }
  } catch (error) {
    console.error('❌ Error getting client info:', error);
  }

  // Test: Send a message to confirm bot is working
  setInterval(() => {
    console.log('💓 Bot heartbeat - Still alive and listening');
  }, 60000); // Every minute
});

client.on('authenticated', () => {
  console.log('🔐 WhatsApp authenticated');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  console.log('⚠️  WhatsApp disconnected:', reason);
});

client.on('loading_screen', (percent, message) => {
  console.log(`⏳ Loading: ${percent}% - ${message}`);
});

client.on('change_state', (state) => {
  console.log(`🔄 State changed to: ${state}`);
});

client.on('remote_session_saved', () => {
  console.log('💾 Remote session saved');
});

// Initialize the client
console.log('🚀 Initializing WhatsApp client...');
client.initialize();

module.exports = client;
