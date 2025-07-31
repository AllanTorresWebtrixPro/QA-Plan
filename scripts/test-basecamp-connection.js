#!/usr/bin/env node

/**
 * Test Basecamp Connection and Authorization
 *
 * This script helps debug Basecamp OAuth and API connection issues.
 */

require("dotenv").config();

async function testBasecampConnection() {
  console.log("🔍 Testing Basecamp Connection and Authorization\n");

  try {
    // Test 1: Check if we can get a valid token
    console.log("1️⃣ Testing OAuth Token Retrieval...");

    const {
      getValidBasecampToken,
    } = require("../services/basecamp-token-service");
    const tokenResult = await getValidBasecampToken("default_user");

    if (tokenResult.success) {
      console.log("✅ Token retrieved successfully");
      console.log(
        `   Token type: ${tokenResult.accessToken?.substring(0, 20)}...`
      );
    } else {
      console.log("❌ Failed to get token:", tokenResult.error);
      return;
    }

    // Test 2: Test Basecamp service connection
    console.log("\n2️⃣ Testing Basecamp Service Connection...");

    const { createBasecampService } = require("../services/basecamp-service");
    const basecampService = createBasecampService("default_user");

    const connectionResult = await basecampService.testConnection();

    if (connectionResult.success) {
      console.log("✅ Basecamp connection successful");
      console.log(`   Found ${connectionResult.data?.length || 0} projects`);
    } else {
      console.log("❌ Basecamp connection failed:", connectionResult.error);

      // Test 3: Check account authorization if connection failed
      if (connectionResult.error?.includes("401")) {
        console.log("\n3️⃣ Checking Account Authorization...");

        const authResult = await basecampService.checkAccountAuthorization();

        if (authResult.success) {
          console.log("✅ Account authorization check successful");
          console.log(
            "   This suggests the token is valid but may not have access to the specific account"
          );
        } else {
          console.log(
            "❌ Account authorization check failed:",
            authResult.error
          );
        }
      }
    }

    // Test 4: Get account info
    console.log("\n4️⃣ Getting Account Information...");

    const accountResult = await basecampService.getAccountInfo();

    if (accountResult.success) {
      console.log("✅ Account info retrieved successfully");
      console.log(
        "   Account details:",
        JSON.stringify(accountResult.data, null, 2)
      );
    } else {
      console.log("❌ Failed to get account info:", accountResult.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testBasecampConnection();
