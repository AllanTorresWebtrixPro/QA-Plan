import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth authorization initiation for Basecamp
 * Redirects users to Basecamp for authorization
 */
export async function GET(request: NextRequest) {
  try {
    // Generate a random state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Build the authorization URL
    const authUrl = new URL('https://launchpad.37signals.com/authorization/new');
    authUrl.searchParams.set('type', 'web_server');
    authUrl.searchParams.set('client_id', process.env.BASECAMP_CLIENT_ID || '');
    authUrl.searchParams.set('redirect_uri', process.env.BASECAMP_REDIRECT_URI || '');
    authUrl.searchParams.set('state', state);

    // Redirect to Basecamp authorization page
    return NextResponse.redirect(authUrl);

  } catch (error) {
    console.error('Error initiating OAuth flow:', error);
    return NextResponse.redirect(
      new URL(`/basecamp-config?error=${encodeURIComponent('Failed to initiate OAuth flow')}`, request.url)
    );
  }
} 