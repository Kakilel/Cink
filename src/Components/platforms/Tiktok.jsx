// Components/platforms/Tiktok.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

function Tiktok({ user, onData }) {
  const [tiktokToken, setTiktokToken] = useState(null);
  const [tiktokOpenId, setTiktokOpenId] = useState(null);
  const [tiktokProfile, setTiktokProfile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("tt_token");
    const openId = params.get("tt_openid");
    if (token && openId) {
      setTiktokToken(token);
      setTiktokOpenId(openId);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (tiktokToken && tiktokOpenId) fetchTiktokProfile();
  }, [tiktokToken, tiktokOpenId]);

  const fetchTiktokProfile = async () => {
    try {
      const res = await axios.get("https://open-api.tiktok.com/oauth/userinfo/v2/", {
        params: { access_token: tiktokToken, open_id: tiktokOpenId }
      });
      const profile = res.data.data.user;
      setTiktokProfile(profile);
      await saveTiktokData("profile", profile);
      if (onData) onData({ avatar: profile.avatar_url, username: profile.display_name });
    } catch (err) {
      console.error("Fetch TikTok profile error:", err);
    }
  };

  const saveTiktokData = async (field, data) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "tiktok", user.uid), { [field]: data }, { merge: true });
    } catch (e) {
      console.error("Save TikTok data error:", e);
    }
  };

  const loginWithTiktok = () => {
    window.location.href = "/api/tiktok/login";
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">TikTok Status</h3>
      {tiktokProfile ? (
        <div className="flex items-center space-x-4">
          <img src={tiktokProfile.avatar_url} alt="TikTok Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <p><strong>Username:</strong> {tiktokProfile.display_name}</p>
            <p><strong>Followers:</strong> {tiktokProfile.follower_count}</p>
            <p><strong>Following:</strong> {tiktokProfile.following_count}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={loginWithTiktok}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          Connect TikTok
        </button>
      )}
    </div>
  );
}

export default Tiktok;
