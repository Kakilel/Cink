import axios from 'axios';

export default async function handler(req, res) {
  const { code, verifier } = req.query;

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.TWITTER_CLIENT_ID,
      redirect_uri: process.env.TWITTER_REDIRECT_URI,
      code,
      code_verifier: verifier,
    });

    const tokenRes = await axios.post('https://api.twitter.com/2/oauth2/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenRes.data.access_token;

    res.redirect(`https://cink.vercel.app/dashboard?twitter_token=${accessToken}`);
  } catch (err) {
    console.error("Discord token error:", {
  status: err.response?.status,
  data: err.response?.data,
  message: err.message,
});
  }
}
