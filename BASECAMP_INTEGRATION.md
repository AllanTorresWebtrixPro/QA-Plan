# Basecamp Integration for QA Plan

This document explains how to set up and use the Basecamp integration feature that automatically creates cards in Basecamp when users add notes to tests.

## Overview

The Basecamp integration automatically creates cards in your Basecamp project's card table whenever a user adds a note to a test in the QA Plan application. This helps track test progress and issues in your project management workflow.

## Features

- **Automatic Card Creation**: Cards are created automatically when users add notes to tests
- **Rich Content**: Cards include test information, user details, and formatted notes
- **Configurable**: Easy setup through a web interface
- **Error Handling**: Graceful fallback if Basecamp is unavailable
- **Testing Tools**: Built-in tools to test connection and create sample cards

## Setup Instructions

### 1. Get Basecamp API Access

1. Go to [Basecamp API Authentication Guide](https://github.com/basecamp/api/blob/master/sections/authentication.md)
2. Create a new API application in your Basecamp account
3. Get your access token (you'll need this for the configuration)

### 2. Find Your Account ID

Your Basecamp account ID is the number in the URL when you're logged into Basecamp:

- URL format: `https://3.basecamp.com/ACCOUNT_ID/`
- Example: If your URL is `https://3.basecamp.com/123456789/`, your account ID is `123456789`

### 3. Configure the Integration

1. Navigate to `/basecamp-config` in your QA Plan application
2. Fill in the configuration form:

   - **Account ID**: Your Basecamp account ID
   - **User Agent**: Your application name (e.g., "QA-Plan (atorres@jokertechnologies.com)")
   - **Project ID**: The ID of your Basecamp project
   - **Card Table ID**: The ID of the card table within your project
   - **Default Column ID**: The ID of the column where new cards should be created

3. Click "Test Connection" to verify your settings
4. Use "Generate .env.local File" to create a configuration template

### 4. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Basecamp API Configuration
BASECAMP_ACCOUNT_ID=your_account_id
BASECAMP_ACCESS_TOKEN=your_access_token_here
BASECAMP_USER_AGENT=QA-Plan (atorres@jokertechnologies.com)
BASECAMP_PROJECT_ID=your_project_id
BASECAMP_CARD_TABLE_ID=your_card_table_id
BASECAMP_DEFAULT_COLUMN_ID=your_default_column_id
```

**Important**: Never commit your access token to version control. Add `.env.local` to your `.gitignore` file.

### 5. Finding IDs

Use the configuration page to discover your available resources:

1. Click "Test Connection" to see available projects
2. Select a project to see its card tables
3. Select a card table to see its columns
4. Copy the IDs to your configuration

## How It Works

### Card Creation Process

When a user adds a note to a test:

1. The note is saved to the database
2. The system retrieves test and user information
3. A Basecamp card is created with:
   - **Title**: "Test Note: [Test Title] (User: [User ID])"
   - **Content**: Formatted HTML with test details, user info, and notes
   - **Location**: The configured default column

### Card Content Format

Cards include the following information:

- Test ID and title
- User ID and name
- Formatted notes (with line breaks preserved)
- Creation timestamp

### Error Handling

- If Basecamp is unavailable, the note is still saved locally
- Connection errors are logged but don't prevent note saving
- The API returns information about Basecamp success/failure

## API Endpoints

### POST /api/qa/add-note

Creates or updates a test note and optionally creates a Basecamp card.

**Request Body:**

```json
{
  "userId": "user123",
  "testId": "test456",
  "notes": "User's test notes here"
}
```

**Response:**

```json
{
  "success": true,
  "basecampCardCreated": true,
  "basecampError": null
}
```

### GET /api/basecamp/config

Tests the Basecamp connection and returns available resources.

**Response:**

```json
{
  "success": true,
  "connection": "Connected successfully",
  "currentConfig": { ... },
  "availableProjects": [ ... ],
  "availableCardTables": [ ... ],
  "availableColumns": [ ... ]
}
```

### POST /api/basecamp/config

Creates a test card to verify the integration.

**Response:**

```json
{
  "success": true,
  "message": "Test card created successfully",
  "cardData": { ... }
}
```

## Troubleshooting

### Common Issues

1. **"Missing required Basecamp environment variables"**

   - Ensure all required environment variables are set in `.env.local`
   - Restart your development server after adding environment variables

2. **"Failed to connect to Basecamp API"**

   - Verify your access token is correct and not expired
   - Check that your account ID is correct
   - Ensure your application has the necessary permissions

3. **"Failed to create Basecamp card"**

   - Verify project ID, card table ID, and column ID are correct
   - Check that the specified column exists and is writable
   - Ensure your access token has write permissions

4. **Cards not being created**
   - Check the browser console for error messages
   - Verify the Basecamp integration is properly configured
   - Look for error logs in your server console

### Testing the Integration

1. Use the configuration page at `/basecamp-config`
2. Click "Test Connection" to verify API access
3. Click "Create Test Card" to verify card creation
4. Check your Basecamp project to see the created card

### Debug Mode

Enable debug logging by setting the environment variable:

```env
DEBUG_BASECAMP=true
```

This will log detailed information about API requests and responses.

## Security Considerations

- **Access Tokens**: Keep your Basecamp access token secure and never expose it in client-side code
- **Environment Variables**: Use `.env.local` for local development and proper environment variable management for production
- **API Permissions**: Use the minimum required permissions for your Basecamp application
- **Rate Limiting**: Be aware of Basecamp's API rate limits and implement appropriate error handling

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Ensure your Basecamp application has the correct redirect URLs
3. Test the integration thoroughly in a staging environment
4. Monitor API usage and error rates
5. Implement proper logging for debugging production issues

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the Basecamp API documentation
3. Check your server logs for detailed error messages
4. Verify your configuration using the `/basecamp-config` page

## Files Modified/Added

- `services/basecamp-service.ts` - Main Basecamp API service
- `services/qa-service.ts` - Updated with test/user retrieval functions
- `app/api/qa/add-note/route.ts` - Updated to create Basecamp cards
- `app/api/basecamp/config/route.ts` - Configuration and testing endpoints
- `app/basecamp-config/page.tsx` - Configuration interface
- `BASECAMP_INTEGRATION.md` - This documentation file
