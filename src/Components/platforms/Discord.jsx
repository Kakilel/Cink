// src/Components/platforms/Discord.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function Discord({ user, onData }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("discord_token");
    if (t) {
      setToken(t);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (token) fetchDiscordProfile();
  }, [token]);

  const fetchDiscordProfile = async () => {
    try {
      const res = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      await save("profile", res.data);
      if (onData)
        onData({
          avatar: `https://cdn.discordapp.com/avatars/${res.data.id}/${res.data.avatar}.png`,
          username: res.data.username,
        });
    } catch (err) {
      console.error("Failed to fetch Discord user", err);
    }
  };

  const save = async (field, data) => {
    if (!user) return;
    await setDoc(doc(db, "discord", user.uid), { [field]: data }, { merge: true });
  };

  const login = () => {
    window.location.href = "/api/discord/login";
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Discord Status</h3>
      {profile ? (
        <div className="flex items-center space-x-4">
          <img
            src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`}
            alt="Discord Avatar"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p><strong>Username:</strong> {profile.username}#{profile.discriminator}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        </div>
      ) : (
        <button onClick={login} className="px-4 py-2 bg-purple-600 text-white rounded">
          Connect Discord
        </button>
      )}
    </div>
  );
}

export default Discord;








