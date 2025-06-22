import { useEffect, useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function Reddit({ user, onData }) {
  const [redditToken, setRedditToken] = useState(null);
  const [redditData, setRedditData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reddit_token");
    if (token) {
      setRedditToken(token);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (redditToken) fetchRedditData();
  }, [redditToken]);

  const fetchRedditData = async () => {
    try {
      const profileRes = await axios.get("https://oauth.reddit.com/api/v1/me", {
        headers: { Authorization: `Bearer ${redditToken}` },
      });
      const profile = profileRes.data;
      setRedditData(profile);
      await saveRedditData("profile", profile);
      if (onData) onData({ avatar: null, username: profile.name });
    } catch (err) {
      console.error("Failed to fetch Reddit profile", err);
    }
  };

  const saveRedditData = async (field, data) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "reddit", user.uid), { [field]: data }, { merge: true });
    } catch (error) {
      console.error(`Failed to save ${field}`, error);
    }
  };

  const loginWithReddit = () => {
    window.location.href = "/api/reddit/login";
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Reddit Status</h3>
      {redditData ? (
        <div>
          <p><strong>Username:</strong> {redditData.name}</p>
          <p><strong>Karma:</strong> {redditData.total_karma}</p>
        </div>
      ) : (
        <button
          onClick={loginWithReddit}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Connect Reddit
        </button>
      )}
    </div>
  );
}

export default Reddit;