import React, { useState, useContext, useEffect } from "react";
import { DashboardContext } from "../Contexts/DashboardContext";
import axios from "axios";

function Dashboard() {
  const { user, socialAccounts, platformData } = useContext(DashboardContext);
  const instagram = platformData?.instagram;

  // GitHub
  const [githubData, setGithubData] = useState(null);
  const githubUsername = "Kakilel";

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
        setGithubData(res.data);
      } catch (error) {
        console.error("Failed to fetch Github data", error);
      }
    };
    fetchGithubData();
  }, []);

  // Spotify
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);



  useEffect(() => {
 const params = new URLSearchParams(window.location.search);
 const token = params.get('access_token')
 if (token) {
  setSpotifyToken(token);
  window.history.replaceState({},document.title,'/dashboard')
 }
  }, []);

  useEffect(() => {
    if (spotifyToken) {
      fetchSpotifyProfile();
    }
  }, [spotifyToken]);

  const loginWithSpotify = () => {
    window.location.href ='api/spotify/login';
  };

  const fetchSpotifyProfile = async () => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });
      setSpotifyProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch Spotify Profile", error);
    }
  };

  // Instagram
  const loginWithInstagram = () => {
    const CLIENT_ID = "3975929792720936";
    const REDIRECT_URI = "http://localhost:3000/instagram-callback";
    const SCOPE = "user_profile,user_media";
    const authURL = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPE}&response_type=code`;

    window.location.href = authURL;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user ? (
        <div className="mb-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user.displayName || "User"}</h2>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>
      ) : (
        <p className="text-red-600 font-medium">No user logged in.</p>
      )}

      {/* Instagram */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Instagram Status</h3>
        {instagram ? (
          <div className="space-y-2">
            <p><strong>Username:</strong> {instagram.username}</p>
            <p><strong>Account Type:</strong> {instagram.account_type}</p>
            <p><strong>Media Count:</strong> {instagram.media_count}</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-2">Instagram not connected</p>
            <button
              onClick={loginWithInstagram}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Connect Instagram
            </button>
          </div>
        )}
      </div>

      {/* GitHub */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">GitHub Status</h3>
        {githubData ? (
          <div className="flex items-center space-x-4">
            <img src={githubData.avatar_url} alt="GitHub avatar" className="w-20 h-20 rounded-full border" />
            <div>
              <p><strong>Username:</strong> {githubData.login}</p>
              <p><strong>Bio:</strong> {githubData.bio || "No bio"}</p>
              <p><strong>Public Repos:</strong> {githubData.public_repos}</p>
              <p><strong>Followers:</strong> {githubData.followers}</p>
            </div>
          </div>
        ) : (
          <p>Loading GitHub data...</p>
        )}
      </div>

      {/* Spotify */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Spotify Status</h3>
        {spotifyProfile ? (
          <div className="flex items-center space-x-4">
            {spotifyProfile.images?.[0]?.url && (
              <img
                src={spotifyProfile.images[0].url}
                alt="Spotify Avatar"
                className="w-20 h-20 rounded-full border"
              />
            )}
            <div>
              <p className="text-gray-800"><strong>Name:</strong> {spotifyProfile.display_name}</p>
              <p className="text-gray-800"><strong>Email:</strong> {spotifyProfile.email}</p>
              <p className="text-gray-800"><strong>Followers:</strong> {spotifyProfile.followers?.total}</p>
              <p className="text-gray-800"><strong>Account Type:</strong> {spotifyProfile.product}</p>
            </div>
          </div>
        ) : (
          <>
          {spotifyToken && <p>Loading Spotify Profile...</p>}
          {!spotifyToken && (
            <button
              onClick={loginWithSpotify}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Connect Spotify
            </button>
                    )}
          </>
          )}
      </div>
    </div>
  );
}


export default Dashboard;
