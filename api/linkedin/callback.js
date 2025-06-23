// /api/linkedin/callback.js
import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;
  const state = req.query.state;

  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
  const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
  const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

  if (!code) {
    console.warn("Missing LinkedIn authorization code. Full request URL:", req.url);
    return res.status(400).send("Missing authorization code");
  }

  try {
    // Request access token from LinkedIn
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      return res.status(400).send("No access token received from LinkedIn");
    }

    // Optionally, you could validate `state` here if you passed one during login

    // Redirect to dashboard with token
    return res.redirect(`/dashboard?linkedin_token=${accessToken}`);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || {};
    const message = err.message;

    console.error("LinkedIn token error:", { status, data, message });

    return res
      .status(status)
      .send(
        `<h2>LinkedIn Authentication Failed</h2><pre>${JSON.stringify(
          data,
          null,
          2
        )}</pre>`
      );
  }
}
