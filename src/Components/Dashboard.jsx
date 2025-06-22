import React, { useState, useContext, useEffect } from "react";
import { DashboardContext } from "../Contexts/DashboardContext";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import pkceChallenge from "pkce-challenge";
import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce";

function Dashboard() {
  const { user, socialAccounts, platformData } = useContext(DashboardContext);
  const instagram = platformData?.instagram;

  // GitHub
  const [githubData, setGithubData] = useState(null);
  const githubUsername = "1";

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const res = await axios.get(
          `https://api.github.com/users/${githubUsername}`
        );
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
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      setSpotifyToken(token);
      window.history.replaceState({}, document.title, "/dashboard");
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
    window.location.href = "api/spotify/login";
  };

  const fetchSpotifyProfile = async () => {
    try {
      const res = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      });
      setSpotifyProfile(res.data);
      saveSpotifyData("profile", res.data);
    } catch (error) {
      console.error("Failed to fetch Spotify Profile", error);
    }
  };

  const saveSpotifyData = async (dataType, type) => {
    if (!user) return;

    const userDocRef = doc(db, "spotify", user.uid);
    try {
      await setDoc(userDocRef, { [dataType]: data }, { merge: true });
      console.log(`${data.Type} saved to Firestore`);
    } catch (error) {
      console.error(`Failed to save ${dataType}:`, error);
    }
  };

  const fetchTopTracks = async () => {
    try {
      const res = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks?limit=10",
        {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        }
      );
      setTopTracks(res.data.items);
      saveSpotifyData("topTracks", res.data.items);
    } catch (error) {
      console.error("Error fetching top tracks.");
    }
  };
  const fetchTopArtists = async () => {
    try {
      const res = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?limit=10",
        {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        }
      );
      setTopArtists(res.data.items);
      saveSpotifyData("topArtists", res.data.items);
    } catch (error) {
      console.error("Error fetching top artists.");
    }
  };
  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(
        "https://api.spotify.com/v1/me/playlists?limit=10",
        {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        }
      );
      setPlaylists(res.data.items);
      saveSpotifyData("playlists", res.data.items);
    } catch (error) {
      console.error("Error fetching playlists.");
    }
  };
  const fetchCurrentlyPlaying = async () => {
    try {
      const res = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing?limit=10",
        {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        }
      );
      if (res.status === 200 && res.data) {
        setCurrentlyPlaying(res.data);
        saveSpotifyData("currentlyPlaying", res.data);
      }
    } catch (error) {
      console.error("Error fetching top tracks.");
    }
  };

  // Instagram
  const loginWithInstagram = () => {
    const CLIENT_ID = " 1060487742258819";
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

  //Twitter

  const [twitterToken, setTwitterToken] = useState(null);
  const [twitterData, setTwitterData] = useState(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("twitter_token"); // your backend should redirect with ?twitter_token=...
    if (token) {
      setTwitterToken(token);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (twitterToken) {
      fetchTwitterProfile();
      fetchTwitterTweets();
    }
  }, [twitterToken]);

  const fetchTwitterProfile = async () => {
    try {
      const res = await axios.get(
        "https://api.twitter.com/2/users/me?user.fields=public_metrics,profile_image_url",
        {
          headers: {
            Authorization: `Bearer ${twitterToken}`,
          },
        }
      );
      setTwitterData(res.data.data);
      saveTwitterData("profile", res.data.data);
    } catch (err) {
      console.error("Failed to fetch Twitter profile", err);
    }
  };

  const fetchTwitterTweets = async () => {
    try {
      const userRes = await axios.get("https://api.twitter.com/2/users/me", {
        headers: { Authorization: `Bearer ${twitterToken}` },
      });
      const userId = userRes.data.data.id;

      const tweetRes = await axios.get(
        `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=public_metrics,created_at`,
        {
          headers: {
            Authorization: `Bearer ${twitterToken}`,
          },
        }
      );
      setTweets(tweetRes.data.data);
      saveTwitterData("tweets", tweetRes.data.data);
    } catch (err) {
      console.error("Failed to fetch tweets", err);
    }
  };

  const saveTwitterData = async () => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "twitter", user.uid),
        { [field]: data },
        { merge: true }
      );
      console.log(`${field} saved to Firestore`);
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
    }
  };

//Discord

const [discordToken, setDiscordToken] = useState(null);
const [discordUser, setDiscordUser] = useState(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("discord_token");
  if (token) {
    setDiscordToken(token);
    window.history.replaceState({}, document.title, "/dashboard");
  }
}, []);

useEffect(() => {
  if (discordToken) fetchDiscordProfile();
}, [discordToken]);

const fetchDiscordProfile = async () => {
  try {
    const res = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${discordToken}` },
    });
    setDiscordUser(res.data);
    saveDiscordData("profile", res.data); // ✅ Save to Firestore
  } catch (err) {
    console.error("Failed to fetch Discord user", err);
  }
};


const loginWithDiscord = () => {
  window.location.href = "/api/discord/login";
};

const saveDiscordData = async (field, data) => {
  if (!user) return;
  try {
    await setDoc(
      doc(db, "discord", user.uid),
      { [field]: data },
      { merge: true }
    );
    console.log(`${field} saved to Firestore`);
  } catch (error) {
    console.error(`Error saving ${field}:`, error);
  }
};

//Reddit

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
  if (redditToken) {
    fetchRedditData();
    fetchRedditSubs();
  }
}, [redditToken]);

const fetchRedditData = async () => {
  try {
    const profileRes = await axios.get("https://oauth.reddit.com/api/v1/me", {
      headers: { Authorization: `Bearer ${redditToken}` },
    });

    const profile = profileRes.data;
    setRedditData(profile);
    await saveRedditData("profile", profile);
  } catch (err) {
    console.error("Failed to fetch Reddit profile", err);
  }
};

const fetchRedditSubs = async () => {
  try {
    const subsRes = await axios.get(
      "https://oauth.reddit.com/subreddits/mine/subscriber",
      {
        headers: { Authorization: `Bearer ${redditToken}` },
      }
    );

    const subs = subsRes.data.data.children.map((s) => s.data.display_name);
    await saveRedditData("subscriptions", subs);
  } catch (err) {
    console.error("Failed to fetch Reddit subscriptions", err);
  }
};

const saveRedditData = async (field, data) => {
  if (!user) return;
  try {
    await setDoc(doc(db, "reddit", user.uid), { [field]: data }, { merge: true });
    console.log(`${field} saved to Firestore`);
  } catch (error) {
    console.error(`Failed to save ${field}`, error);
  }
};

const loginWithReddit = () => {
  window.location.href = "/api/reddit/login"; // Make sure this route returns the Reddit login URL
};



//Linked In
const [linkedinToken,setLinkedinToken] = useState(null)
const [linkedinProfile,setLinkedinProfile] = useState(null)
const [linkedinPosts,setLinkedinPosts] = useState([])

useEffect(() =>{
    const params = new URLSearchParams(window.location.search);
  const token = params.get("linkedin_token");
  if (token) {
    setLinkedinToken(token);
    window.history.replaceState({}, document.title, "/dashboard");
  }
},[]);

useEffect(() =>{
  if(linkedinToken){
    fetchLinkedinProfile();
    fetchLinkedinPosts();
  }
},[linkedinToken]);

const loginWithLinkedIn = async () =>{
  window.location.href = 'api/linkedin/login'
}
const fetchLinkedinProfile = async () =>{
    try {
    const res = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${linkedinToken}` },
    });
    setLinkedinProfile(res.data);
    await saveLinkedInData("profile", res.data);
  } catch (err) {
    console.error("LinkedIn profile error:", err);
  }
}
const fetchLinkedinPosts = async () => {
  try {
    const res = await axios.get("https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:YOUR_ID)", {
      headers: { Authorization: `Bearer ${linkedinToken}` },
    });
    setLinkedinPosts(res.data.elements);
    await saveLinkedInData("posts", res.data.elements);
  } catch (err) {
    console.error("LinkedIn posts error:", err);
  }
};

const saveLinkedInData = async (type, data) => {
  if (!user) return;
  const ref = doc(db, "linkedin", user.uid);
  await setDoc(ref, { [type]: data }, { merge: true });
}


  const loginWithTwitter = () => {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    sessionStorage.setItem("twitter_verifier", verifier);
    window.location.href = `/api/twitter/login?challenge=${challenge}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user ? (
        <div className="mb-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user.displayName || "User"}
          </h2>
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
            <p>
              <strong>Username:</strong> {instagram.username}
            </p>
            <p>
              <strong>Account Type:</strong> {instagram.account_type}
            </p>
            <p>
              <strong>Media Count:</strong> {instagram.media_count}
            </p>
            <p>
              <strong>Followers:</strong> {instagram.followers_count || "N/A"}
            </p>
            <p>
              <strong>Likes:</strong> {instagram.likes_count || "N/A"}
            </p>
            <p>
              <strong>Comments:</strong> {instagram.comments_count || "N/A"}
            </p>
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
            <img
              src={githubData.avatar_url}
              alt="GitHub avatar"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <p>
                <strong>Username:</strong> {githubData.login}
              </p>
              <p>
                <strong>Bio:</strong> {githubData.bio || "No bio"}
              </p>
              <p>
                <strong>Public Repos:</strong> {githubData.public_repos}
              </p>
              <p>
                <strong>Followers:</strong> {githubData.followers}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading GitHub data...</p>
        )}
      </div>

      {/* Twitter */}

      <div>
        <h3 className=" font-bold ">Twitter Status</h3>
        {twitterToken ? (
          <p>Twitter connected</p>
        ) : ( 
          <div>
            <p>Twitter not Connected</p>
          <button
            onClick={loginWithTwitter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Connect Twitter
          </button>
          </div>
        )}
      </div>


        {/* Reddit */}
        
<div className="bg-white p-4 rounded shadow mb-8">
  <h3 className="text-lg font-semibold mb-4">Reddit Status</h3>
  {redditData ? (
    <div>
      <p><strong>Username:</strong> {redditData.name}</p>
      <p><strong>Karma:</strong> {redditData.total_karma}</p>
      <p><strong>Created:</strong> {new Date(redditData.created_utc * 1000).toLocaleDateString()}</p>
    </div>
  ) : (
    <button
      onClick={loginWithReddit}
      className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
    >
      Connect Reddit
    </button>
  )}
</div>



      {/* Discord */}


      <div className="mb-8 bg-white p-4 rounded shadow">
  <h3 className="text-lg font-semibold mb-4">Discord Status</h3>
  {discordUser ? (
    <div className="flex items-center space-x-4">
      <img
        src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
        alt="Discord Avatar"
        className="w-16 h-16 rounded-full"
      />
      <div>
        <p><strong>Username:</strong> {discordUser.username}#{discordUser.discriminator}</p>
        <p><strong>ID:</strong> {discordUser.id}</p>
        <p><strong>Email:</strong> {discordUser.email}</p>
      </div>
    </div>
  ) : (
    <button onClick={loginWithDiscord} className="px-4 py-2 bg-purple-600 text-white rounded">
      Connect Discord
    </button>
  )}
</div>

  {/* Linked In */}


        <div className="bg-white p-4 rounded shadow mb-8">
  <h3 className="text-lg font-semibold mb-4">LinkedIn Status</h3>
  {linkedinProfile ? (
    <>
      <p><strong>ID:</strong> {linkedinProfile.id}</p>
      <p><strong>First Name:</strong> {linkedinProfile.localizedFirstName}</p>
      <p><strong>Last Name:</strong> {linkedinProfile.localizedLastName}</p>
      {/* Render posts */}
      {linkedinPosts.length > 0 && (
        <div>
          <h4>Recent Posts</h4>
          <ul>
            {linkedinPosts.map(post => (
              <li key={post.id}>{post.specificContent?.com.linkedin.ugc.ShareContent?.shareCommentary?.text || "No content"}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  ) : (
    <button
      onClick={loginWithLinkedIn}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Connect LinkedIn
    </button>
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
                <p className="text-gray-800">
                  <strong>Name:</strong> {spotifyProfile.display_name}
                </p>
                <p className="text-gray-800">
                  <strong>Email:</strong> {spotifyProfile.email}
                </p>
                <p className="text-gray-800">
                  <strong>Followers:</strong> {spotifyProfile.followers?.total}
                </p>
                <p className="text-gray-800">
                  <strong>Account Type:</strong> {spotifyProfile.product}
                </p>
              </div>
            </div>
            {/* Top Tracks*/}
            {topTracks.length > 0 && (
              <div>
                <h4>Top 10 Tracks</h4>
                <ul>
                  {topTracks.map((track, idx) => (
                    <li key={track.id}>
                      <span>{idx + 1}.</span>
                      <img src={track.album.images[0]?.url} alt={track.name} />
                      <div>
                        <p>{track.name}</p>
                        <p>{track.artists.map((a) => a.name).join(", ")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/*Top Artists */}
            {topArtists.length > 0 && (
              <div>
                <h4>Top 10 Artists</h4>
                <ul>
                  {topArtists.map((artist, idx) => (
                    <li key={artist.id}>
                      <span>{idx + 1}.</span>
                      {artist.images[0]?.url && (
                        <img src={artist.images[0].url} alt={artist.name} />
                      )}
                      <p>{artist.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            ;{/*Playlists */}
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
            )}
            ;{/*Currently Playing */}
            {currentlyPlaying?.item && (
              <div>
                <h4>Currently Playing</h4>
                <div>
                  <img
                    src={currentlyPlaying.item.album.images[0]?.url}
                    alt={currentlyPlaying.item.name}
                  />
                  <div>
                    <p>{currentlyPlaying.item.name}</p>
                    <p>
                      {currentlyPlaying.item.artists
                        .map((a) => a.name)
                        .join(", ")}
                    </p>
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
