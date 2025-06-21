import React, { useState, useContext, useEffect } from "react";
import { DashboardContext } from "../Contexts/DashboardContext";
import axios from "axios";
import {doc, setDoc} from 'firebase/firestore'
import {db} from '../firebase';

function Dashboard() {
  const { user, socialAccounts, platformData } = useContext(DashboardContext);
  const instagram = platformData?.instagram;

  // GitHub
  const [githubData, setGithubData] = useState(null);
  const githubUsername = "18Mori";

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
  const [topTracks, setTopTracks] = useState([])
  const [topArtists,setTopArtists] = useState([])
  const [playlists,setPlaylists] = useState([])
  const [currentlyPlaying,setCurrentlyPlaying] = useState(null)


  
  



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
      fetchTopTracks();
      fetchTopArtists();
      fetchPlaylists();
      fetchCurrentlyPlaying();
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
      saveSpotifyData('profile',res.data);
    } catch (error) {
      console.error("Failed to fetch Spotify Profile", error);
    }
  };

  const saveSpotifyData = async (dataType, type) => {
    if(!user) return;

    const userDocRef = doc(db, 'spotify', user.uid);
    try{
      await setDoc(
        userDocRef,{[dataType]:data},{merge:true}
      );
      console.log(`${data.Type} saved to Firestore`);
    } catch (error){
      console.error(`Failed to save ${dataType}:`,error);
    }
  };

  const fetchTopTracks = async () => {
    try{
      const res = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10',{
        headers:{ Authorization:`Bearer ${spotifyToken}`}
      });
      setTopTracks(res.data.items);
      saveSpotifyData('topTracks',res.data.items);
    }catch (error){
      console.error('Error fetching top tracks.')
    }
  };
  const fetchTopArtists = async () => {
    try{
      const res = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=10',{
        headers:{ Authorization:`Bearer ${spotifyToken}`}
      });
      setTopArtists(res.data.items);
      saveSpotifyData('topArtists',res.data.items);
    }catch (error){
      console.error('Error fetching top artists.')
    }
  };
  const fetchPlaylists = async () => {
    try{
      const res = await axios.get('https://api.spotify.com/v1/me/playlists?limit=10',{
        headers:{ Authorization:`Bearer ${spotifyToken}`}
      });
      setPlaylists(res.data.items);
      saveSpotifyData('playlists',res.data.items);
    }catch (error){
      console.error('Error fetching playlists.')
    }
  };
  const fetchCurrentlyPlaying = async () => {
    try{
      const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing?limit=10',{
        headers:{ Authorization:`Bearer ${spotifyToken}`}
      });
      if(res.status === 200 && res.data) {
        setCurrentlyPlaying(res.data);
        saveSpotifyData('currentlyPlaying',res.data);
      }
    }catch (error){
      console.error('Error fetching top tracks.')
    }
  };

  // Instagram
const loginWithInstagram = () => {
  const CLIENT_ID =' 1060487742258819';
  const REDIRECT_URI = process.env.REACT_APP_IG_REDIRECT_URI;
  const SCOPE = "instagram_basic,instagram_graph_user_media";
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${SCOPE}&response_type=code`;

  window.location.href = authUrl;
};

const fetchInstagramProfile = async (token) => {
  const res = await axios.get(`https://graph.facebook.com/v19.0/me`, {
    params: {
      fields: "id,username,account_type",
      access_token: token,
    },
  });
  console.log(res.data); // Save or display
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
            <p><strong>Followers:</strong> {instagram.followers_count || 'N/A'}</p>
            <p><strong>Likes:</strong> {instagram.likes_count || 'N/A'}</p>
            <p><strong>Comments:</strong> {instagram.comments_count || 'N/A'}</p>
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
          <>
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

        {/* Top Tracks*/} 
            {topTracks.length > 0 && (
              <div>
              <h4>Top 10 Tracks</h4>
              <ul>
              {topTracks.map((track,idx) =>(
                <li key={track.id}><span>{idx + 1}.</span>
                <img src={track.album.images[0]?.url} alt={track.name} />
                <div>
                  <p>{track.name}</p>
                  <p>{track.artists.map(a => a.name).join(', ')}</p>
                </div>
                </li>
              ))}
              </ul>
              </div>
            )}

            {/*Top Artists */}
            {topArtists.length > 0 &&(
              <div>
              <h4>Top 10 Artists</h4>
              <ul>
              {topArtists.map((artist,idx) =>(
                <li key={artist.id}><span>{idx + 1}.</span>
                {artist.images[0]?.url &&(
                  <img src={artist.images[0].url} alt={artist.name} />
                )}
                <p>{artist.name}</p>
                </li>
              ))}
              </ul>
              </div>
            )};

            {/*Playlists */}
            {playlists.length > 0 && (
              <div>
              <h4>Your Playlists</h4>
              <ul>
              {playlists.map((playlist) => (
                <li key={playlist.id}>
                  {playlist.images[0]?.url && (
                    <img src={playlist.images[0].url} alt={playlist.name} />
                  )}
                  <div>
                    <p>{playlist.name}</p>
                    <p>{playlist.tracks.total} tracks</p>
                  </div>
                </li>
              ))}
              </ul>
              </div>
            )};

            {/*Currently Playing */}
            {currentlyPlaying?.item &&(
              <div>
              <h4>Currently Playing</h4>
              <div>
              <img src={currentlyPlaying.item.album.images[0]?.url} alt={currentlyPlaying.item.name} />
              <div>
              <p>{currentlyPlaying.item.name}</p>
              <p>{currentlyPlaying.item.artists.map(a => a.name).join(', ')}</p>
              </div>
              </div>
              </div>
            )}

            </>
            
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
