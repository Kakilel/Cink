// /api/tiktok/login.js
export default function handler(req, res) {
  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
  const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI;
  const scope = "user.info.basic";

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${CLIENT_KEY}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=${scope}&state=your_custom_state`;

  res.redirect(authUrl);
}
