import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function DiscordPage({ user }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const ref = doc(db, "discord", user.uid);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setProfile(snapshot.data().profile);
      }
    };
    fetch();
  }, [user]);

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold">
        Loading Discord data...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#5865F2] text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold"> Discord Profile</h1>
          <Link to="/dashboard" className="text-sm underline hover:text-gray-200">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center space-x-6 bg-white/10 rounded-xl p-6 shadow-lg">
          <img
            src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`}
            alt="Discord Avatar"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div>
            <p className="text-xl font-semibold">
              {profile.username}#{profile.discriminator}
            </p>
            <p className="text-sm text-white/80">ID: {profile.id}</p>
            <p className="text-sm text-white/80">Email: {profile.email}</p>
            <p className="text-sm text-white/80">Verified: {profile.verified ? "✅" : "❌"}</p>
            {profile.banner && (
              <p className="mt-2 text-sm">
                Banner: <a
                  href={`https://cdn.discordapp.com/banners/${profile.id}/${profile.banner}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-white"
                >
                  View
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscordPage;
