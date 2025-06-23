import axios from "axios";

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) return res.status(400).send("Missing code");

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      },
      { headers: { Accept: "application/json" } }
    );

    const { access_token } = tokenRes.data;

    if (!access_token) {
      return res.status(400).send("Failed to get GitHub access token");
    }

    res.redirect(`/dashboard?github_token=${access_token}`);
  } catch (err) {
    console.error("GitHub OAuth error:", err.response?.data || err.message);
    res.status(500).send("GitHub login failed");
  }
}
