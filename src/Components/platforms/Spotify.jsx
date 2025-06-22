// src/Components/platforms/Spotify.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function Spotify({ user, onData }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // Get access_token from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("access_token");
    if (t) {
      setToken(t);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  // Fetch all Spotify data once token is available
  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchTopTracks();
      fetchTopArtists();
      fetchPlaylists();
      fetchCurrentlyPlaying();
    }
  }, [token]);

  const login = () => {
    window.location.href = "/api/spotify/login";
  };

  const save = async (field, data) => {
    if (!user) return;
    const ref = doc(db, "spotify", user.uid);
    await setDoc(ref, { [field]: data }, { merge: true });
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      await save("profile", res.data);
    } catch (err) {
      console.error("Spotify profile error", err);
    }
  };

  const fetchTopTracks = async () => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me/top/tracks?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopTracks(res.data.items);
      await save("topTracks", res.data.items);
    } catch (err) {
      console.error("Spotify top tracks error", err);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me/top/artists?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopArtists(res.data.items);
      await save("topArtists", res.data.items);
    } catch (err) {
      console.error("Spotify top artists error", err);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me/playlists?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaylists(res.data.items);
      await save("playlists", res.data.items);
    } catch (err) {
      console.error("Spotify playlists error", err);
    }
  };

  const fetchCurrentlyPlaying = async () => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 && res.data) {
        setCurrentlyPlaying(res.data);
        await save("currentlyPlaying", res.data);
      }
    } catch (err) {
      console.error("Spotify now playing error", err);
    }
  };

  // Pass structured data to dashboard filter
  useEffect(() => {
    if (!profile || !onData) return;

    onData({
      avatar: profile.images?.[0]?.url,
      username: profile.display_name,
      playlists,
      topTracks,
      topArtists,
      currentlyPlaying,
    });
  }, [profile, playlists, topTracks, topArtists, currentlyPlaying, onData]);

  return (
    <div className="hidden">
      {!token && (
        <button
          onClick={login}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Connect Spotify
        </button>
      )}
    </div>
  );
}

export default Spotify;
