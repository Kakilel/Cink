export default function handler(req, res) {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
  const scope = "read:user repo";

  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scope}`;

  res.redirect(url);
}
