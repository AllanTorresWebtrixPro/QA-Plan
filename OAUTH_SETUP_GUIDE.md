# Basecamp OAuth 2.0 Setup Guide

This guide will help you set up OAuth 2.0 authentication with Basecamp to get access tokens for your QA Plan integration.

## 🔐 Step 1: Register Your Application

1. **Go to Basecamp Launchpad:**
   - Visit: https://launchpad.37signals.com/
   - Sign in with your Basecamp account

2. **Create a New Application:**
   - Click "New Application"
   - Fill in the application details:
     - **Name:** `AQ-APP`
     - **Company:** `Jokertechnologies`
     - **Website:** `https://www.jokertechnologies.com/`
   - Upload an icon (optional)

3. **Select Products:**
   - ✅ Check "Basecamp 4" (this is what we need)
   - You can uncheck the others

4. **Set Redirect URI:**
   - **For Development:** `http://localhost:3000/api/auth/basecamp/callback`
   - **For Production:** `https://yourdomain.com/api/auth/basecamp/callback`

5. **Register the App:**
   - Click "Register this app"
   - **Save your Client ID and Client Secret!**

## 🔑 Step 2: Configure Environment Variables

Create or update your `.env.local` file:

```env
# Basecamp API Configuration
BASECAMP_ACCOUNT_ID=your_account_id
BASECAMP_ACCESS_TOKEN=your_access_token_here
BASECAMP_USER_AGENT=AQ-APP (atorres@jokertechnologies.com)
BASECAMP_PROJECT_ID=your_project_id
BASECAMP_CARD_TABLE_ID=your_card_table_id
BASECAMP_DEFAULT_COLUMN_ID=your_default_column_id

# OAuth Configuration (from Basecamp Launchpad)
BASECAMP_CLIENT_ID=your_client_id_from_launchpad
BASECAMP_CLIENT_SECRET=your_client_secret_from_launchpad
BASECAMP_REDIRECT_URI=http://localhost:3000/api/auth/basecamp/callback
```

## 🚀 Step 3: Get Your Access Token

### Method A: Using the OAuth Flow (Recommended)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the configuration page:**
   - Go to: `http://localhost:3000/basecamp-config`

3. **Click "Get Token":**
   - This will open Basecamp's authorization page
   - Authorize your application
   - You'll be redirected back with your access token

### Method B: Using the Setup Script

1. **Run the setup script:**
   ```bash
   npm run setup:basecamp
   ```

2. **Follow the prompts:**
   - Enter your Client ID and Client Secret from Basecamp Launchpad
   - The script will generate your `.env.local` file

## 🔍 Step 4: Find Your Account ID

1. **Go to your Basecamp account:**
   - Visit: https://3.basecamp.com/
   - Log in

2. **Look at the URL:**
   - It will look like: `https://3.basecamp.com/123456789/`
   - The number (`123456789`) is your Account ID

## 🧪 Step 5: Test the Integration

1. **Test the connection:**
   - Go to `/basecamp-config`
   - Click "Test Connection"

2. **Create a test card:**
   - Click "Create Test Card"
   - Check your Basecamp project for the new card

3. **Test with real data:**
   - Add a note to any test in your QA app
   - Verify a card is created in Basecamp

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Make sure the redirect URI in Basecamp Launchpad matches exactly
   - For development: `http://localhost:3000/api/auth/basecamp/callback`

2. **"Client ID not found"**
   - Verify your `BASECAMP_CLIENT_ID` is correct
   - Check that you copied it from Basecamp Launchpad

3. **"Access denied"**
   - Make sure you authorized the application in Basecamp
   - Check that your account has the necessary permissions

4. **"Token expired"**
   - Access tokens can expire
   - Use the "Get Token" button to get a new one

### Debug Mode:

Enable debug logging by adding to your `.env.local`:
```env
DEBUG_BASECAMP=true
```

## 🔒 Security Notes

- **Never commit your `.env.local` file** to version control
- **Keep your Client Secret secure**
- **Use HTTPS in production**
- **Rotate tokens regularly**

## 📚 API Endpoints Created

- `GET /api/auth/basecamp/authorize` - Initiates OAuth flow
- `GET /api/auth/basecamp/callback` - Handles OAuth callback
- `GET /api/basecamp/config` - Tests configuration
- `POST /api/basecamp/config` - Creates test cards

## 🎯 Next Steps

After setting up OAuth:

1. **Test the integration thoroughly**
2. **Set up production environment variables**
3. **Monitor API usage and errors**
4. **Implement token refresh logic if needed**

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Basecamp's OAuth documentation
3. Check your server logs for detailed error messages
4. Verify your configuration using the `/basecamp-config` page 