# WhatsApp Cloud API - Quick Setup Guide

## Step-by-Step Configuration

### 1. Create Meta Developer App (10 minutes)

1. **Go to Meta Developers**
   - Visit: https://developers.facebook.com/apps
   - Login with your Facebook account

2. **Create New App**
   - Click "Create App"
   - Choose "Business" as app type
   - Fill in:
     - App Name: "Lanchas Booking Bot"
     - App Contact Email: your-email@example.com
   - Click "Create App"

3. **Add WhatsApp Product**
   - In the left sidebar, click "+ Add Product"
   - Find "WhatsApp" and click "Set Up"
   - This automatically creates:
     - Test Business Account (WABA)
     - Test phone number
     - Template "hello_world"

### 2. Get API Credentials (5 minutes)

1. **Phone Number ID**
   - Go to: WhatsApp > API Setup
   - Copy the number next to "Phone number ID"
   - Example: `123456789012345`
   - Save as: `WHATSAPP_PHONE_NUMBER_ID`

2. **Access Token**
   - In the same page, find "Temporary access token"
   - Click "Generate" (valid for 24 hours)

   **For Production - Create Permanent Token:**
   - Go to: Settings > Basic
   - Scroll to "App Secret" and click "Show"
   - Save this as: `WHATSAPP_APP_SECRET`

   - Go to: Business Settings > Users > System Users
   - Click "Add" → Create system user (name: "WhatsApp Bot")
   - Click on the system user → "Generate New Token"
   - Select your app and permissions: `whatsapp_business_messaging`
   - Copy token → This doesn't expire!
   - Save as: `WHATSAPP_ACCESS_TOKEN`

3. **WABA ID**
   - Go to: WhatsApp > API Setup
   - Find "WhatsApp Business Account ID"
   - Copy the number
   - Save as: `WHATSAPP_WABA_ID`

4. **Verify Token**
   - Create your own random string (e.g., "lanchas-webhook-2026-abc123")
   - This is used to verify webhook requests from Meta
   - Save as: `WHATSAPP_VERIFY_TOKEN`

### 3. Configure Webhook (5 minutes)

**Important:** Do this AFTER deploying to Railway so you have a public URL.

1. **Get Your Public URL**
   - Deploy your app to Railway first
   - Get your URL: `https://your-app.railway.app`

2. **Set Up Webhook in Meta**
   - Go to: WhatsApp > Configuration
   - Click "Edit" next to "Webhook"

   - **Callback URL:**
     ```
     https://your-app.railway.app/api/whatsapp/webhook
     ```

   - **Verify Token:**
     - Use the same value you set for `WHATSAPP_VERIFY_TOKEN`
     - Example: `lanchas-webhook-2026-abc123`

   - Click "Verify and Save"
   - If successful, you'll see a green checkmark

3. **Subscribe to Messages**
   - In the same webhook section
   - Find "Webhook fields"
   - Check: `messages`
   - Click "Save"

### 4. Add Test Phone Numbers (2 minutes)

The test number can only send messages to verified recipients.

1. **Add Recipients**
   - Go to: WhatsApp > API Setup
   - Find "To" field with "+ Add recipient" button
   - Click it
   - Enter phone with country code: `+573001234567`
   - Recipient will receive a code via WhatsApp
   - Enter the code to verify
   - Repeat for up to 5 phone numbers

### 5. Update Railway Environment Variables

Add these variables to your Railway project:

```env
WHATSAPP_PHONE_NUMBER_ID=<from step 2.1>
WHATSAPP_ACCESS_TOKEN=<from step 2.2>
WHATSAPP_WABA_ID=<from step 2.3>
WHATSAPP_VERIFY_TOKEN=<from step 2.4>
WHATSAPP_APP_SECRET=<from step 2.2>
```

**In Railway Dashboard:**
1. Go to your project
2. Click on your service
3. Go to "Variables" tab
4. Click "+ New Variable"
5. Add each variable above
6. Click "Deploy" to restart with new variables

### 6. Test the Integration

1. **Send Test Message**
   - From a verified phone number
   - Send "lancha" to the test number
   - Example test number format: `+15550100001`

2. **Expected Response**
   - Welcome message
   - Photo of Lancha 1 with details
   - Photo of Lancha 2 with details
   - Instructions for booking

3. **Check Logs**
   - In Railway, go to "Deployments" tab
   - Click on latest deployment
   - View logs - should see:
     ```
     📥 Webhook received: {...}
     📨 Message from 573001234567, Type: text
     ✅ Message sent to 573001234567
     ```

### 7. Test Full Booking Flow

1. **Step 1:** Send "lancha" → Receive info
2. **Step 2:** Send "25 de enero, lancha 1" → Receive availability confirmation
3. **Step 3:** Send "Juan Pérez" → Receive booking summary and payment instructions
4. **Step 4:** Send photo → Receive confirmation with booking reference
5. **Step 5:** In admin panel, approve booking → Customer receives confirmation

## Troubleshooting

### Webhook Verification Failed
**Symptoms:** Red X next to webhook URL
**Solution:**
- Check that `WHATSAPP_VERIFY_TOKEN` in Railway matches exactly what you entered in Meta
- Make sure your app is deployed and accessible
- Try the webhook URL in browser: should return 403 or error (not timeout)

### Messages Not Being Received
**Symptoms:** Send "lancha" but no response
**Solution:**
- Check Railway logs for any errors
- Verify webhook is subscribed to `messages` field
- Confirm phone number is added as test recipient
- Make sure all environment variables are set

### "Invalid Access Token" Error
**Symptoms:** Error 190 in logs
**Solution:**
- Temporary tokens expire after 24h - create System User token
- Verify `WHATSAPP_ACCESS_TOKEN` is correct
- Check token has `whatsapp_business_messaging` permission

### "Recipient Not Allowed" Error
**Symptoms:** Can't send messages to a number
**Solution:**
- Add phone number as test recipient in Meta dashboard
- Verify phone number with code sent via WhatsApp
- For production, use a verified business phone number

### Images Not Sending
**Symptoms:** Text messages work but images fail
**Solution:**
- Check Cloudinary credentials are correct
- Verify image URLs are publicly accessible
- Check Railway logs for specific error messages

## Environment Variables Reference

```env
# Required for WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=     # From WhatsApp > API Setup
WHATSAPP_ACCESS_TOKEN=        # System User Token (permanent) or Temporary Token
WHATSAPP_WABA_ID=             # WhatsApp Business Account ID
WHATSAPP_VERIFY_TOKEN=        # Your chosen secret string
WHATSAPP_APP_SECRET=          # From Settings > Basic > App Secret

# Existing variables (keep these)
DATABASE_URL=                 # PostgreSQL connection string
JWT_SECRET=                   # For admin authentication
CLOUDINARY_CLOUD_NAME=        # For image uploads
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=production
```

## Next Steps After Setup

1. **Test thoroughly** with multiple scenarios
2. **Monitor logs** for first few days
3. **Request Business Verification** (optional but recommended)
   - Go to Business Settings > Security Center
   - Submit business documents
   - Wait 2-10 business days
4. **Add Production Phone Number**
   - Go to WhatsApp > API Setup
   - Click "Add phone number"
   - Verify with SMS
   - Update `WHATSAPP_PHONE_NUMBER_ID` in Railway
5. **Remove temporary token** and use System User token
6. **Scale up** as needed (1000 free conversations/month)

## Important Notes

- Test number allows only 5 recipients (for testing)
- Messages are FREE when customer initiates (within 24h window)
- Your use case = customer writes "lancha" first = FREE
- Production number requires business verification (recommended)
- Keep `WHATSAPP_APP_SECRET` secure - used to verify webhook signatures
- System User tokens don't expire (unlike temporary tokens)

## Support

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Business Manager Help](https://www.facebook.com/business/help)
- [Developer Community Forum](https://developers.facebook.com/community/)
