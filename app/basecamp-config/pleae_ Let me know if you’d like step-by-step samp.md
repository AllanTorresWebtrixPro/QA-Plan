<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# pleae: Let me know if you’d like step-by-step sample code for handling the callback in a specific programming language!

Here’s a step-by-step example of how to handle the OAuth callback in **Node.js/Express** after Basecamp redirects the user back to your redirect URI with a `code`. This example assumes your redirect URI is `https://yourapp.com/oauth/callback`.

### Step 1: Set Up the Express Route

```js
const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config(); // To easily manage your secrets

// This is your registered redirect URI:
app.get('/oauth/callback', async (req, res) => {
  const authCode = req.query.code; // Get the code from the query string

  if (!authCode) {
    return res.status(400).send('No code found in the callback request.');
  }

  try {
    // Step 2: Exchange code for access token
    const tokenResponse = await axios.post('https://launchpad.37signals.com/authorization/token', {
      type: 'web_server',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code: authCode
    });

    // Get the tokens from the response
    const { access_token, refresh_token, expires_at } = tokenResponse.data;

    // Step 3: Use or store the tokens as needed
    // You should securely save the tokens—this is just an example
    res.json({ access_token, refresh_token, expires_at });

    // Step 4: Redirect or continue flow as needed
    // For example, res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send('Error exchanging code for token: ' + error.message);
  }
});

app.listen(3000, () => {
  console.log('OAuth callback server listening on port 3000');
});
```


### Environment Variables (`.env`)

```
CLIENT_ID=your_basecamp_client_id
CLIENT_SECRET=your_basecamp_client_secret
REDIRECT_URI=https://yourapp.com/oauth/callback
```

**Key Points:**

- The `/oauth/callback` route receives the `code` from Basecamp.
- You POST the code and app credentials back to Basecamp to get the access token and refresh token.
- With the access token, you can now make authenticated API requests to Basecamp on behalf of the user.
- Always securely store the received tokens.

Let me know if you want similar code for a different language or need help with another part of the flow!

<div style="text-align: center">⁂</div>

[^1]: image.jpg

