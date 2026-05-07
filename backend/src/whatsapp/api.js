const axios = require('axios');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Validate environment variables on startup
if (!PHONE_NUMBER_ID) {
  console.error('❌ WHATSAPP_PHONE_NUMBER_ID is not set!');
}
if (!ACCESS_TOKEN) {
  console.error('❌ WHATSAPP_ACCESS_TOKEN is not set!');
}
if (PHONE_NUMBER_ID && ACCESS_TOKEN) {
  console.log('✅ WhatsApp API credentials loaded');
  console.log(`📱 Phone Number ID: ${PHONE_NUMBER_ID}`);
  console.log(`🔑 Access Token: ${ACCESS_TOKEN.substring(0, 20)}...`);
}

// Send text message
async function sendMessage(to, text) {
  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(url, {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text }
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Message sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

// Send image with caption
async function sendImage(to, imageUrl, caption) {
  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(url, {
      messaging_product: 'whatsapp',
      to: to,
      type: 'image',
      image: {
        link: imageUrl,
        caption: caption
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Image sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending image:', error.response?.data || error.message);
    throw error;
  }
}

// Send template message (for initiating conversation)
async function sendTemplate(to, templateName, languageCode = 'es') {
  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(url, {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Template sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending template:', error.response?.data || error.message);
    throw error;
  }
}

// Download media by ID
async function downloadMedia(mediaId) {
  try {
    // Step 1: Get media URL
    const mediaUrl = `${WHATSAPP_API_URL}/${mediaId}`;
    const metaResponse = await axios.get(mediaUrl, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const downloadUrl = metaResponse.data.url;

    // Step 2: Download the file
    const fileResponse = await axios.get(downloadUrl, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
      responseType: 'arraybuffer'
    });

    return Buffer.from(fileResponse.data);
  } catch (error) {
    console.error('❌ Error downloading media:', error.response?.data || error.message);
    throw error;
  }
}

// Mark message as read
async function markAsRead(messageId) {
  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;

  try {
    await axios.post(url, {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Error marking as read:', error);
  }
}

module.exports = {
  sendMessage,
  sendImage,
  sendTemplate,
  downloadMedia,
  markAsRead
};
