import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function Spotify({ user }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const ref = doc(db, "spotify", user.uid);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setData(snapshot.data());
      }
    };
    fetchData();
  }, [user]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Spotify data...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-500 via-black to-gray-900 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">🎧 Spotify Dashboard</h1>
          <Link to="/dashboard" className="text-green-300 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile */}
        <div className="text-center mb-10">
          <img
            src={data.profile?.images?.[0]?.url}
            alt="Avatar"
            className="w-28 h-28 rounded-full mx-auto border-4 border-green-500"
          />
          <h2 className="text-2xl font-bold mt-3">{data.profile?.display_name}</h2>
          <p className="text-green-200">{data.profile?.email}</p>
          <p className="text-sm mt-1 text-gray-300">Followers: {data.profile?.followers?.total}</p>
        </div>

        {/* Currently Playing */}
        {data.currentlyPlaying?.item && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-2">▶️ Now Playing</h3>
            <div className="bg-black/40 rounded-xl p-4 flex items-center gap-4">
              <img
                src={data.currentlyPlaying.item.album.images?.[0]?.url}
                alt="Now Playing"
                className="w-16 h-16 rounded"
              />
              <div>
                <p className="font-bold">{data.currentlyPlaying.item.name}</p>
                <p className="text-sm text-gray-300">
                  {data.currentlyPlaying.item.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Artists */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">🔥 Top Artists</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.topArtists?.map((artist) => (
              <div
                key={artist.id}
                className="bg-black/30 p-4 rounded-xl text-center hover:bg-black/50 transition"
              >
                <img
                  src={artist.images?.[0]?.url}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full mx-auto mb-2"
                />
                <p className="font-semibold">{artist.name}</p>
                <p className="text-sm text-gray-300">{artist.genres?.[0]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top Tracks */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">🎶 Top Tracks</h3>
          <ul className="space-y-3">
            {data.topTracks?.map((track, i) => (
              <li
                key={track.id}
                className="bg-black/30 p-3 rounded-lg hover:bg-black/50 transition"
              >
                <p className="font-medium">
                  {i + 1}. {track.name}
                </p>
                <p className="text-sm text-gray-300">
                  {track.artists.map((a) => a.name).join(", ")} — {track.album.name}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Playlists */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">📁 Your Playlists</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {data.playlists?.map((pl) => (
              <div
                key={pl.id}
                className="bg-black/30 rounded-xl p-4 hover:bg-black/50 transition"
              >
                <img
                  src={pl.images?.[0]?.url}
                  alt={pl.name}
                  className="w-full h-36 object-cover rounded-md mb-2"
                />
                <p className="font-semibold">{pl.name}</p>
                <p className="text-sm text-gray-300">{pl.tracks.total} tracks</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Spotify;
