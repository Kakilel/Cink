import React, { useState,useContext, useEffect } from "react";
import { DashboardContext } from "../Contexts/DashboardContext";
import axios from "axios";
function Dashboard() {

  // INSTAGRAM
  const { user, socialAccounts, platformData } = useContext(DashboardContext);
  const instagram = platformData?.instagram;
  const loginWithInstagram = () => {
    const CLIENT_ID = "3975929792720936";
    const REDIRECT_URI = "http://localhost:3000/instagram-callback";
    const SCOPE = "user_profile,user_media";
    const authURL = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${SCOPE}&response_type=code`;

    window.location.href = authURL;
  };


  //GITHUB
  const [githubData, setGithubData] = useState(null);
  const githubUsername = 'Kakilel'
  useEffect(() =>{
    const fetchGithubData = async() =>{
      try{
        const res = await axios.get(`https://api.github.com/users/${githubUsername}`)
        setGithubData(res.data);
      } catch (error){
        console.error('Failed to fetch Github data',error)
      }
    }
    fetchGithubData();
  },[]);



  //SPOTIFY
  const [spotifyToken , setSpotifyToken] = useState(null)
  const [spotifyProfile,setSpotifyProfile] = useState(null);

  const SPOT_ID = '95dac5031f664383822de1395947c85d'
const SPOT_URI = 'http://localhost:3000/spotify-callback';
  const SPOT_SCOPES = ['user-read-private', 'user-read-email']
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  


  useEffect(() =>{
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')){
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      setSpotifyToken(token);
      window.location.hash = '';
    }
  },[])
  useEffect(() =>{
    if(spotifyToken){
      console.log('Spotify Token:', spotifyToken)
      fetchSpotifyProfile();
    }
  },[spotifyToken] )

  const loginWithSpotify = () =>{
    const spotUrl = `${AUTH_ENDPOINT}?client_id=${SPOT_ID}&redirect_uri=${encodeURIComponent(SPOT_URI)}&response_type=token&scope=${SPOT_SCOPES.join('')}`;
    window.location.href = spotUrl;
  };

  const fetchSpotifyProfile=async () =>{
    try{
      const res = await axios.get('https://api.spotify.com/v1/me',{
        headers: {
          Authorization:`Bearer ${spotifyToken}`,
        },
      });
      setSpotifyProfile(res.data);
    }catch (error){
      console.error('Failed to fetch Spotify Profile', error);
    }
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


      {/* INSTAGRAM */}
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


      {instagram && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Widgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-3 rounded">
              <h4 className="font-semibold text-sm">Followers</h4>
              <p className="text-gray-600 text-sm">Unavailable with Basic Display</p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <h4 className="font-semibold text-sm">Media Count</h4>
              <p className="text-gray-600 text-sm">{instagram.media_count}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <h4 className="font-semibold text-sm">Account Type</h4>
              <p className="text-gray-600 text-sm">{instagram.account_type}</p>
            </div>
          </div>


      {/* GITHUB */}
      <div>
        <h3>Github Status</h3>
        {githubData ?(
          <div>
            <img src={githubData.avatar_url} alt="Github avatar" />
            <div>
              <p><strong>Username:</strong> {githubData.login}</p>
              <p><strong>Bio:</strong> {githubData.bio || "No bio"}</p>
              <p><strong>Public Repos:</strong> {githubData.public_repos}</p>
              <p><strong>Followers:</strong> {githubData.followers}</p>
            </div>
          </div>
        ):(
          <p>Loading Github Data... </p>
        )}
      </div>

          {/*  SPOTIFY*/}
          <div>
            <h3>Spotify Status</h3>
            {spotifyProfile ?(
              <div>
                <img src={spotifyProfile.images?.[0]?.url} alt="Spotify Avatar" />

                <div>
                  <p><strong>Name:</strong>{spotifyProfile.display_name}</p>
                  <p><strong>Email:</strong>{spotifyProfile.email}</p>
                  <p><strong>Followers:</strong>{spotifyProfile.followers.total}</p>
                  <p><strong>Account Type:</strong>{spotifyProfile.product}</p>
                </div>
              </div>
            ):(
              <button onClick={loginWithSpotify}>Connect Spotify</button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default Dashboard;
