import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

  try {
    const { data: tokenData } = await axios.post(
      "https://open-api.tiktok.com/oauth/access_token/",
      new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.TIKTOK_REDIRECT_URI
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, open_id } = tokenData.data;
    res.redirect(`/dashboard?tt_token=${access_token}&tt_openid=${open_id}`);
  } catch (err) {
    console.error("TikTok token error:", err.response?.data || err.message);
    res.status(500).send("Failed to get TikTok token");
  }
};
