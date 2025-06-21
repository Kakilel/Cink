const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const router = express.Router();

const CLIENT_ID = '1060487742258819';
const CLIENT_SECRET = '4738bd71a5c31ba789aa04b0a9b96eba';
const REDIRECT_URI = process.env.IG_REDIRECT_URI;

router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenRes = await axios.post(
      `https://graph.facebook.com/v19.0/oauth/access_token`,
      querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // You can fetch IG user data here or just redirect
    res.redirect(`https://yourapp.vercel.app/dashboard?ig_token=${accessToken}`);
  } catch (err) {
    console.error("Instagram token exchange failed", err.response?.data || err.message);
    res.status(500).send("Token error");
  }
});

module.exports = router;
