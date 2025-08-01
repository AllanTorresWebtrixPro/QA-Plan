import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface BasecampToken {
  id: number;
  user_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  token_type: string;
  scope?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  token_type?: string;
  scope?: string;
}

/**
 * Save OAuth tokens to the database
 */
export async function saveBasecampTokens(
  userId: string,
  tokenData: TokenData
): Promise<{ success: boolean; error?: string; token?: BasecampToken }> {
  try {
    // First, deactivate any existing tokens for this user
    await supabase
      .from("basecamp_oauth_tokens")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("is_active", true);

    // Insert the new token
    const { data, error } = await supabase
      .from("basecamp_oauth_tokens")
      .insert({
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_at,
        token_type: tokenData.token_type || "Bearer",
        scope: tokenData.scope,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving Basecamp tokens:", error);
      return { success: false, error: error.message };
    }

    return { success: true, token: data };
  } catch (error) {
    console.error("Error in saveBasecampTokens:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get the active OAuth token for a user
 */
export async function getActiveBasecampToken(
  userId: string
): Promise<{ success: boolean; error?: string; token?: BasecampToken }> {
  try {
    let { data: basecamp_oauth_tokens, error } = await supabase
      .from("basecamp_oauth_tokens")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false })
      .limit(1)
      .single();
    console.log("userId Here", userId);
    console.log("basecamp_oauth_tokens", basecamp_oauth_tokens);
    if (error) {
      if (error.code === "PGRST116") {
        // No token found
        return { success: false, error: "No active token found" };
      }
      console.error("Error fetching Basecamp token:", error);
      return { success: false, error: error.message };
    }

    return { success: true, token: basecamp_oauth_tokens };
  } catch (error) {
    console.error("Error in getActiveBasecampToken:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token: BasecampToken): boolean {
  if (!token.expires_at) return false;

  const expiresAt = new Date(token.expires_at);
  const now = new Date();

  return expiresAt <= now;
}

/**
 * Refresh an expired token using the refresh token
 */
export async function refreshBasecampToken(
  userId: string,
  refreshToken: string
): Promise<{ success: boolean; error?: string; token?: BasecampToken }> {
  try {
    const response = await fetch(
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
          refresh_token: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Token refresh failed:", errorText);
      return {
        success: false,
        error: `Token refresh failed: ${response.status} ${response.statusText}`,
      };
    }

    const tokenData = await response.json();

    // Save the new tokens
    return await saveBasecampTokens(userId, {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
    });
  } catch (error) {
    console.error("Error in refreshBasecampToken:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Deactivate a user's tokens (logout)
 */
export async function deactivateBasecampTokens(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("basecamp_oauth_tokens")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) {
      console.error("Error deactivating Basecamp tokens:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deactivateBasecampTokens:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get a valid access token for a user (handles refresh if needed)
 */
export async function getValidBasecampToken(
  userId: string
): Promise<{ success: boolean; error?: string; accessToken?: string }> {
  try {
    const tokenResult = await getActiveBasecampToken(userId);

    if (!tokenResult.success || !tokenResult.token) {
      return { success: false, error: "No active token found" };
    }

    const token = tokenResult.token;

    // Check if token is expired
    if (isTokenExpired(token)) {
      if (!token.refresh_token) {
        return {
          success: false,
          error: "Token expired and no refresh token available",
        };
      }

      // Try to refresh the token
      const refreshResult = await refreshBasecampToken(
        userId,
        token.refresh_token
      );

      if (!refreshResult.success) {
        return { success: false, error: refreshResult.error };
      }

      return { success: true, accessToken: refreshResult.token!.access_token };
    }

    return { success: true, accessToken: token.access_token };
  } catch (error) {
    console.error("Error in getValidBasecampToken:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
