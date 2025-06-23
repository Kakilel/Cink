// src/Components/platforms/LinkedIn.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function LinkedIn({ user, onData }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  // Extract token from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("linkedin_token");
    if (t) {
      setToken(t);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  // Fetch LinkedIn data after token is available
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Fetch profile and then fetch posts using user ID
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      await setDoc(doc(db, "linkedin", user.uid), { profile: res.data }, { merge: true });

      if (onData) {
        const avatar =
          res.data.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]?.identifier || null;

        onData({
          avatar,
          username: res.data.localizedFirstName + " " + res.data.localizedLastName,
        });
      }

      // ✅ Fetch posts after we get the profile ID
      fetchPosts(res.data.id);
    } catch (err) {
      console.error("LinkedIn profile error:", err.response?.data || err.message);
    }
  };

  // Fetch UGC posts using the actual profile ID
  const fetchPosts = async (profileId) => {
    try {
      const res = await axios.get(
        `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:${profileId})`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(res.data.elements);
      await setDoc(doc(db, "linkedin", user.uid), { posts: res.data.elements }, { merge: true });
    } catch (err) {
      console.error("LinkedIn posts error:", err.response?.data || err.message);
    }
  };

  const login = () => {
    window.location.href = "/api/linkedin/login";
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">LinkedIn Status</h3>

      {profile ? (
        <>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={
                profile.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]?.identifier
              }
              alt="LinkedIn Avatar"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p>
                <strong>Name:</strong> {profile.localizedFirstName} {profile.localizedLastName}
              </p>
              <p>
                <strong>ID:</strong> {profile.id}
              </p>
            </div>
          </div>

          {posts.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Recent Posts</h4>
              <ul className="list-disc ml-5 space-y-2">
                {posts.map((post, i) => (
                  <li key={i}>
                    {
                      post.specificContent?.["com.linkedin.ugc.ShareContent"]?.shareCommentary
                        ?.text || "No content"
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <button onClick={login} className="px-4 py-2 bg-blue-600 text-white rounded">
          Connect LinkedIn
        </button>
      )}
    </div>
  );
}

export default LinkedIn;
