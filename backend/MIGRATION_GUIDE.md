# WhatsApp Cloud API Migration Guide

## Migration Completed ✅

The code has been successfully migrated from whatsapp-web.js to WhatsApp Cloud API.

### Changes Summary

1. **Dependencies Updated** (`package.json`)
   - ❌ Removed: `whatsapp-web.js`, `qrcode`, `qrcode-terminal`
   - ✅ Added: `axios`

2. **New Files Created**
   - `/src/whatsapp/api.js` - WhatsApp Cloud API wrapper functions
   - `/src/api/whatsapp.js` - Webhook endpoint (GET/POST)

3. **Files Modified**
   - `/src/whatsapp/handlers.js` - Refactored from event listeners to webhook handler
   - `/src/server.js` - Added WhatsApp webhook route
   - `/src/index.js` - Simplified (removed WhatsApp client initialization)
   - `/src/api/bookings.js` - Updated to use new API
   - `/Dockerfile` - Removed Chromium dependencies

4. **Files Deleted**
   - `/src/whatsapp/client.js` - No longer needed

## Next Steps

### 1. Install Dependencies

Run in the backend directory:

```bash
cd /Users/afa/Documents/personal/lanchas/backend
npm install
```

### 2. Configure Meta WhatsApp Cloud API

#### Step A: Create Meta Business Account
1. Go to https://business.facebook.com
2. Create or select your business
3. Complete business information

#### Step B: Create Developer App
1. Go to https://developers.facebook.com/apps
2. Click "Create App" → Select "Business"
3. Fill in app details
4. Add "WhatsApp" product to your app

#### Step C: Get Credentials
In the WhatsApp > API Setup section, you'll find:
- **Phone Number ID** - The ID of your test number
- **Access Token** - Click "Generate" for a temporary token (24h) or create a System User for permanent token
- **WABA ID** - WhatsApp Business Account ID
- **App Secret** - Found in Settings > Basic

#### Step D: Configure Webhook
1. In WhatsApp > Configuration
2. Set Callback URL: `https://your-backend.railway.app/api/whatsapp/webhook`
3. Set Verify Token: Create a random string (you choose this)
4. Subscribe to field: `messages`
5. Click "Verify and Save"

### 3. Update Environment Variables

Add these variables to Railway (or your `.env` file for local testing):

```env
# Existing variables (keep these)
DATABASE_URL=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production

# NEW WhatsApp Cloud API variables
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAa...your-long-token...
WHATSAPP_WABA_ID=987654321098765
WHATSAPP_VERIFY_TOKEN=your-random-secret-verify-token
WHATSAPP_APP_SECRET=abc123def456ghi789
```

**Important Notes:**
- `WHATSAPP_VERIFY_TOKEN` - You create this string (e.g., "mi-token-secreto-2026")
- `WHATSAPP_ACCESS_TOKEN` - For production, create a System User token (doesn't expire)
- Test number allows messaging with up to 5 phone numbers

### 4. Deploy to Railway

```bash
# Commit changes
git add .
git commit -m "Migrate to WhatsApp Cloud API

- Remove whatsapp-web.js dependency
- Add WhatsApp Cloud API integration
- Implement webhook handler
- Simplify Dockerfile (no Chromium needed)
- Update bookings API to use new WhatsApp API"

git push
```

Railway will automatically deploy.

### 5. Test the Integration

#### Local Testing (Optional)
If testing locally before deploying:

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your server:
   ```bash
   npm run dev
   ```

3. Expose with ngrok:
   ```bash
   ngrok http 3000
   ```

4. Update webhook URL in Meta with ngrok URL:
   ```
   https://abc123.ngrok.io/api/whatsapp/webhook
   ```

#### Production Testing

1. After deploying to Railway, get your public URL
2. Update webhook URL in Meta:
   ```
   https://your-app.railway.app/api/whatsapp/webhook
   ```

3. Add your phone number to test recipients:
   - Go to WhatsApp > API Setup
   - Click "To" field
   - Add your phone number with country code (e.g., +573001234567)

4. Send test message:
   - Send "lancha" from your WhatsApp to the test number
   - Should receive boat information and images

#### Verify in Logs

Check Railway logs for:
```
📥 Webhook received: {...}
📨 Message from 573001234567, Type: text
✅ Message sent to 573001234567
```

### 6. Testing Checklist

- [ ] Webhook verification (GET request) works
- [ ] Receive "lancha" message → Bot sends boat info
- [ ] Send date and boat selection → Bot confirms availability
- [ ] Send name → Bot asks for payment receipt
- [ ] Send image → Bot confirms receipt and creates booking
- [ ] Admin approves booking → Customer receives confirmation
- [ ] Admin rejects booking → Customer receives rejection notice

## Common Issues & Solutions

### Issue: "Webhook verification failed"
**Solution:** Check that `WHATSAPP_VERIFY_TOKEN` matches exactly what you set in Meta dashboard.

### Issue: "Invalid signature"
**Solution:** Verify `WHATSAPP_APP_SECRET` is correct.

### Issue: "Error sending message: Invalid token"
**Solution:**
- Check `WHATSAPP_ACCESS_TOKEN` is valid
- Temporary tokens expire after 24h - create a System User token for production

### Issue: "Phone number not found"
**Solution:**
- Check `WHATSAPP_PHONE_NUMBER_ID` is correct
- Verify you're using the test number or a verified production number

### Issue: "Recipient not allowed"
**Solution:** Add the recipient's phone number to the test recipients list in Meta dashboard.

## Rollback Plan

If you need to rollback to whatsapp-web.js:

```bash
git revert HEAD
git push
```

Railway will automatically deploy the previous version.

## Production Checklist

Before going live with a production number:

- [ ] Business verification completed in Meta (optional but recommended)
- [ ] System User token created (doesn't expire)
- [ ] Production phone number added and verified
- [ ] Webhook URL uses HTTPS (Railway provides this)
- [ ] Environment variables set in Railway
- [ ] Test complete conversation flow end-to-end
- [ ] Monitor logs for first 24h after launch

## Cost Estimate

With WhatsApp Cloud API:
- **First 1000 conversations/month:** FREE
- **Messages within 24h window:** FREE (when customer initiates)

For your use case (customers write "lancha" first):
- **Estimated cost:** $0/month for MVP (under 1000 conversations)

Only pay if:
- You send messages initiating conversations (outside 24h window)
- You exceed 1000 conversations/month

## Support Resources

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Send Messages Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages)
- [Webhooks Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Pricing 2026](https://respond.io/blog/whatsapp-business-api-pricing)

## Migration Benefits

✅ No more QR code scanning
✅ No more session corruption
✅ No Chromium/Puppeteer overhead
✅ Native webhook support
✅ More stable in production
✅ Official Meta API with better support
✅ Smaller Docker image (~500MB vs ~1.5GB)
✅ Faster cold starts
✅ 1000 free conversations/month
