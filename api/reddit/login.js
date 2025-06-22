const loginWithReddit = () => {
  const client_id = process.env.REACT_APP_REDDIT_CLIENT_ID;
  const redirect_uri = process.env.REACT_APP_REDDIT_REDIRECT_URI;
  const scope = "identity mysubreddits";

  const url = `https://www.reddit.com/api/v1/authorize?client_id=${client_id}&response_type=code&state=randomstring&redirect_uri=${encodeURIComponent(redirect_uri)}&duration=temporary&scope=${scope}`;
  window.location.href = url;
};
