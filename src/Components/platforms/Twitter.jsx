import { useEffect, useState } from "react";
import axios from "axios";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { generateCodeVerifier, generateCodeChallenge } from "../../utils/pkce";

function Twitter({ user, onData }) {
  const [twitterToken, setTwitterToken] = useState(null);
  const [twitterData, setTwitterData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("twitter_token");
    if (token) {
      setTwitterToken(token);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (twitterToken) fetchTwitterProfile();
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
      const data = res.data.data;
      setTwitterData(data);
      await saveTwitterData("profile", data);
      if (onData) onData({ avatar: data.profile_image_url, username: data.username });
    } catch (err) {
      console.error("Failed to fetch Twitter profile", err);
    }
  };

  const saveTwitterData = async (field, data) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "twitter", user.uid), { [field]: data }, { merge: true });
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
    }
  };

  const loginWithTwitter = () => {
    const verifier = generateCodeVerifier();
    const challenge = generateCodeChallenge(verifier);
    sessionStorage.setItem("twitter_verifier", verifier);
    window.location.href = `/api/twitter/login?challenge=${challenge}`;
  };
}

export default Twitter