export default async function handler(req, res) {
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const REDIRECT_URI = encodeURIComponent("https://cink.vercel.app/api/discord/callback");
  const SCOPE = "identify email";

  const authUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
}
