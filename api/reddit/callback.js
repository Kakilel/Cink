import axios from 'axios';

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code');

  try {
    const creds = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');

    const tokenRes = await axios.post('https://www.reddit.com/api/v1/access_token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDDIT_REDIRECT_URI,
    }), {
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const access_token = tokenRes.data.access_token;

    res.redirect(`/dashboard?reddit_token=${access_token}`);
  } catch (error) {
    console.error("Reddit Token Error", error.response?.data || error.message);
    res.status(500).send('Failed to get Reddit token');
  }
}
