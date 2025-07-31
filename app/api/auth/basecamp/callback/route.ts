import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth callback handler for Basecamp integration
 * Handles the authorization code exchange for access tokens
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(
      new URL(`/basecamp-config?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  // Check if we have the authorization code
  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(
      new URL('/basecamp-config?error=no_code', request.url)
    );
  }

  try {
    // Exchange the authorization code for access tokens
    const tokenResponse = await fetch('https://launchpad.37signals.com/authorization/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'web_server',
        client_id: process.env.BASECAMP_CLIENT_ID,
        client_secret: process.env.BASECAMP_CLIENT_SECRET,
        redirect_uri: process.env.BASECAMP_REDIRECT_URI,
        code: code
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_at } = tokenData;

    // Store the tokens securely (in production, use a database)
    // For now, we'll redirect with the token for easy setup
    const successUrl = new URL('/basecamp-config', request.url);
    successUrl.searchParams.set('success', 'true');
    successUrl.searchParams.set('access_token', access_token);
    successUrl.searchParams.set('refresh_token', refresh_token || '');
    successUrl.searchParams.set('expires_at', expires_at || '');

    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.redirect(
      new URL(`/basecamp-config?error=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`, request.url)
    );
  }
} 