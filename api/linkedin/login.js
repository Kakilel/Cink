// /api/linkedin/login.js
export default async function handler(req, res) {
  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
  const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
  const SCOPE = "r_liteprofile r_emailaddress w_member_social";

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;

  res.redirect(authUrl);
}
