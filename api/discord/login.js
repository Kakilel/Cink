export default function handler(req, res) {
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=identify%20email`;

  res.redirect(url);
}
