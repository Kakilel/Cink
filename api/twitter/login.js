export default async function handler(req, res) {
  const { challenge } = req.query;
  const state = crypto.randomUUID();

  const clientId = process.env.TWITTER_CLIENT_ID;
  const redirectUri = process.env.TWITTER_REDIRECT_URI;

  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=tweet.read%20users.read%20like.read%20follows.read%20offline.access&state=${state}&code_challenge=${challenge}&code_challenge_method=plain`;

  res.redirect(authUrl);
}
