// src/Components/platforms/LinkedIn.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function LinkedIn({ user, onData }) {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("linkedin_token");
    if (t) {
      setToken(t);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchPosts();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      await setDoc(doc(db, "linkedin", user.uid), { profile: res.data }, { merge: true });
      if (onData) onData({ avatar: null, username: res.data.localizedFirstName });
    } catch (err) {
      console.error("LinkedIn profile error:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:YOUR_ID)", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.elements);
      await setDoc(doc(db, "linkedin", user.uid), { posts: res.data.elements }, { merge: true });
    } catch (err) {
      console.error("LinkedIn posts error:", err);
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
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>First Name:</strong> {profile.localizedFirstName}</p>
          <p><strong>Last Name:</strong> {profile.localizedLastName}</p>
          {posts.length > 0 && (
            <div>
              <h4>Recent Posts</h4>
              <ul>
                {posts.map((post, i) => (
                  <li key={i}>{post.specificContent?.com.linkedin.ugc.ShareContent?.shareCommentary?.text || "No content"}</li>
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