import querystring from 'querystring';

export default function handler(req, res) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = 'https://cink.vercel.app/api/spotify/callback';
  const scope= [
  "user-read-email",
  "user-top-read",
  "user-read-currently-playing",
  "playlist-read-private",
  "user-read-playback-state",
].join(" ");


  const authUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
  });

  res.redirect(authUrl);
}
