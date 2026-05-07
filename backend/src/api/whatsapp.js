const express = require('express');
const crypto = require('crypto');
const { handleWebhook } = require('../whatsapp/handlers');

const router = express.Router();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

// Webhook verification (GET)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook handler (POST)
router.post('/webhook', async (req, res) => {
  // Verify signature
  const signature = req.headers['x-hub-signature-256'];
  if (signature) {
    const hmac = crypto.createHmac('sha256', APP_SECRET);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    if (signature !== digest) {
      console.log('❌ Invalid signature');
      return res.sendStatus(403);
    }
  }

  console.log('📥 Webhook received:', JSON.stringify(req.body, null, 2));

  try {
    await handleWebhook(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
