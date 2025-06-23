import { useEffect, useState } from "react";
import axios from "axios";

function Github({ username = "1", onData }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`https://api.github.com/users/${username}`);
        setData(res.data);
        if (onData) onData({ avatar: res.data.avatar_url, username: res.data.login });
      } catch (error) {
        console.error("Failed to fetch Github data", error);
      }
    };
    fetch();
  }, [username]);

  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">GitHub Status</h3>
      {data ? (
        <div className="flex items-center space-x-4">
          <img src={data.avatar_url} alt="GitHub avatar" className="w-20 h-20 rounded-full border" />
          <div>
            <p><strong>Username:</strong> {data.login}</p>
            <p><strong>Bio:</strong> {data.bio || "No bio"}</p>
            <p><strong>Public Repos:</strong> {data.public_repos}</p>
            <p><strong>Followers:</strong> {data.followers}</p>
          </div>
        </div>
      ) : (
        <p>Loading GitHub data...</p>
      )}
    </div>
  );
}

export default Github;
