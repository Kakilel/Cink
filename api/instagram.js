// api/instagram.js
const axios = require("axios");
const querystring = require("querystring");

const CLIENT_ID = ' 1451947249561861';
const CLIENT_SECRET ='d331471d9cc3bf0b86e0ebaa1ce2434d';
const REDIRECT_URI = 'https://cink.vercel.app/instagram-callback';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const tokenRes = await axios.post(
      'https://graph.facebook.com/v19.0/oauth/access_token',
      querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Redirect to dashboard with token in query
    res.redirect(`https://cink.vercel.app/?ig_token=${accessToken}`);
  } catch (error) {
    console.error("Instagram token error:", error.response?.data || error.message);
    res.status(500).json({ error: "Token exchange failed" });
  }
}
