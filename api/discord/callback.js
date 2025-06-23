import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenRes.data;

    if (!access_token) {
      console.error("Discord token exchange failed", tokenRes.data);
      return res.status(400).send("No access token received");
    }

   
    res.redirect(`/dashboard?discord_token=${access_token}`);
  } catch (err) {
    console.error("Discord token error:", {
  status: err.response?.status,
  data: err.response?.data,
  message: err.message,
});

  }
}
