const express = require('express');
const router = express.Router();

// Debug endpoint to check environment variables
router.get('/debug/env', (req, res) => {
  const vars = {
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID ? '✅ Set' : '❌ Missing',
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN ? `✅ Set (${process.env.WHATSAPP_ACCESS_TOKEN.substring(0, 20)}...)` : '❌ Missing',
    WHATSAPP_WABA_ID: process.env.WHATSAPP_WABA_ID ? '✅ Set' : '❌ Missing',
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN ? '✅ Set' : '❌ Missing',
    WHATSAPP_APP_SECRET: process.env.WHATSAPP_APP_SECRET ? '✅ Set' : '❌ Missing',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
    NODE_ENV: process.env.NODE_ENV || 'not set'
  };

  res.json({
    message: 'Environment Variables Check',
    variables: vars,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
