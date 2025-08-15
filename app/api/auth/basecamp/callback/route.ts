import { NextRequest, NextResponse } from "next/server";
import { saveBasecampTokens } from "@/services/basecamp-token-service";

/**
 * OAuth callback handler for Basecamp integration
 * Handles the authorization code exchange for access tokens
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const userId = searchParams.get("state") || "default_user"; // Use state as userId for now

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(
      new URL(
        `/basecamp-config?error=${encodeURIComponent(error)}`,
        request.url
      )
    );
  }

  // Check if we have the authorization code
  if (!code) {
    console.error("No authorization code received");
    return NextResponse.redirect(
      new URL("/basecamp-config?error=no_code", request.url)
    );
  }

  try {
    // Exchange the authorization code for access tokens
    const tokenResponse = await fetch(
      "https://launchpad.37signals.com/authorization/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "web_server",
          client_id: process.env.BASECAMP_CLIENT_ID,
          client_secret: process.env.BASECAMP_CLIENT_SECRET,
          redirect_uri: process.env.BASECAMP_REDIRECT_URI,
          code: code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      throw new Error(
        `Token exchange failed: ${tokenResponse.status} ${tokenResponse.statusText}`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_at, token_type, scope } =
      tokenData;
    console.log("Token data:", tokenData);
    // Save tokens to database
    const saveResult = await saveBasecampTokens(userId, {
      access_token,
      refresh_token,
      expires_at,
      token_type,
      scope,
    });

    if (!saveResult.success) {
      console.error("Failed to save tokens to database:", saveResult.error);
      return NextResponse.redirect(
        new URL(
          `/basecamp-config?error=${encodeURIComponent(
            "Failed to save tokens"
          )}`,
          request.url
        )
      );
    }

    console.log("Tokens saved successfully for user:", userId);

    // Redirect back to config page with success
    const successUrl = new URL("/basecamp-config", request.url);
    successUrl.searchParams.set("success", "true");
    successUrl.searchParams.set("user_id", userId);
    successUrl.searchParams.set("token_saved", "true");

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.redirect(
      new URL(
        `/basecamp-config?error=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`,
        request.url
      )
    );
  }
}
