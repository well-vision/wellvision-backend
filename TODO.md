# SMS Provider Migration: Twilio to txtmsg.lk

## ✅ Completed Tasks
- [x] Install AWS SDK (`aws-sdk` package)
- [x] Update `utils/smsClient.js` to support Twilio, AWS SNS, TextBee, and txtmsg.lk
- [x] Update `routes/notificationRoutes.js` to handle different response formats
- [x] Add new `/verify-sms-config` endpoint for all providers
- [x] Maintain backward compatibility with existing Twilio setup

## 🔧 Configuration Required

### For txtmsg.lk Setup (Recommended for Sri Lanka):
1. **Sign up at txtmsg.lk**: Visit [txtmsg.lk](https://txtmsg.lk) and create an account
2. **Get API Key**: Go to your dashboard and get your API key
3. **Optional Sender ID**: Register a custom sender ID if needed

4. **Update your .env file**:
   ```
   # Set SMS provider to txtmsg.lk
   SMS_PROVIDER=txtmsg

   # txtmsg.lk Credentials
   TXTMSG_API_KEY=your-api-key-here
   TXTMSG_SENDER_ID=your-sender-id  # Optional
   ```

## 🧪 Testing Steps

1. **Update Environment Variables**
2. **Restart Server**: `npm run dev`
3. **Test SMS Endpoint**:
   - POST `/api/notifications/test/sms`
   - Should work with txtmsg.lk
4. **Verify Configuration**:
   - GET `/api/notifications/verify-sms-config`
   - Confirms credentials and connection

## 📋 API Changes

### New Endpoints:
- `GET /api/notifications/verify-sms-config` - Verifies SMS configuration for txtmsg.lk

### Updated Endpoints:
- `POST /api/notifications/test/sms` - Now returns `provider` field indicating txtmsg.lk was used

### Response Format:
```json
{
  "success": true,
  "sid": "message-id",
  "status": "sent",
  "provider": "txtmsg.lk"
}
```

## 🚀 Benefits of txtmsg.lk (Recommended for Sri Lanka)

- **Local Provider**: Sri Lankan SMS service with excellent local coverage
- **Cost Effective**: Competitive pricing for Sri Lankan numbers
- **Reliable**: Local infrastructure optimized for Sri Lanka
- **Simple API**: Easy to integrate with GET-based requests
- **Custom Sender ID**: Support for branded sender IDs

## 🔍 Troubleshooting

### For txtmsg.lk:
- **API Key**: Ensure your API key is valid and has sufficient credits
- **Sender ID**: Verify your sender ID is approved (if using custom sender ID)
- **Phone Format**: txtmsg.lk requires international format without + prefix
- **Account Balance**: Check if you have sufficient credits in your account

### General:
- **Environment Variables**: Restart server after updating .env
- **Network**: Ensure your server can reach the SMS provider's API
- **Rate Limits**: Check if you're hitting API rate limits

## 📞 Next Steps

1. Set up txtmsg.lk credentials in .env file
2. Test the SMS functionality using `/api/notifications/test/sms`
3. Monitor delivery rates and costs
