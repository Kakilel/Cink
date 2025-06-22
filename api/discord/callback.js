import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;

  try {
    const response = await axios.post("https://discord.com/api/oauth2/token", new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://cink.vercel.app/api/discord/callback",
      scope: "identify email"
    }), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const { access_token } = response.data;
    res.redirect(`/dashboard?discord_token=${access_token}`);
  } catch (error) {
    console.error("Discord token error:", error.response?.data || error.message);
    res.status(500).send("OAuth token exchange failed");
  }
}
