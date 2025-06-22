export default function handler(req, res) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  const scope = "user.info.basic";
  const state = Math.random().toString(36).substring(2);

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  res.redirect(authUrl);
}
