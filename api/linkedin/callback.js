// /api/linkedin/callback.js
import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;

  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
  const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
  const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

  try {
    const tokenRes = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    const accessToken = tokenRes.data.access_token;

    res.redirect(`/dashboard?linkedin_token=${accessToken}`);
  } catch (err) {
    console.error("Discord token error:", {
  status: err.response?.status,
  data: err.response?.data,
  message: err.message,
});
  }
}
