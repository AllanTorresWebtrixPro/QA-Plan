#!/usr/bin/env node

/**
 * Test Token Retrieval
 *
 * Simple test to verify token retrieval is working.
 */

require("dotenv").config();

async function testTokenRetrieval() {
  console.log("🔍 Testing Token Retrieval\n");

  try {
    const {
      getActiveBasecampToken,
    } = require("../services/basecamp-token-service");

    // Test with the user IDs from your table
    const testUserIds = ["8req534easf", "n2n8k7gbs47", "default_user"];

    for (const userId of testUserIds) {
      console.log(`\nTesting with user_id: ${userId}`);
      const result = await getActiveBasecampToken(userId);

      if (result.success) {
        console.log(`✅ Token found for ${userId}`);
        console.log(`   Token ID: ${result.token?.id}`);
        console.log(
          `   Access Token: ${result.token?.access_token?.substring(0, 20)}...`
        );
      } else {
        console.log(`❌ No token found for ${userId}: ${result.error}`);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testTokenRetrieval();
