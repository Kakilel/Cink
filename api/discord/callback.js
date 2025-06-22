import axios from 'axios';

export default async function handler(req, res) {
  const code = req.query.code;

  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'https://cink.com/api/discord/callback?provider=discord', // must match your Discord app
    scope: 'identify email',
  });

  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const access_token = tokenRes.data.access_token;

    // Optional: Fetch user profile
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Handle user data (save to Firestore, session, etc.)
    res.redirect(`/dashboard?discord_token=${access_token}`);
  } catch (err) {
    console.error('Discord token exchange failed:', err.response?.data || err.message);
    res.status(500).send('Failed to authenticate with Discord');
  }
}
