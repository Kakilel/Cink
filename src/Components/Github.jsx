import { useEffect, useState } from "react";
import axios from "axios";

function GitHub({ token, onData }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchGitHubData = async () => {
      try {
        const userRes = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reposRes = await axios.get("https://api.github.com/user/repos?per_page=10", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(userRes.data);
        setRepos(reposRes.data);

        if (onData) {
          onData({ avatar: userRes.data.avatar_url, username: userRes.data.login });
        }
      } catch (err) {
        console.error("GitHub fetch error:", err);
      }
    };

    fetchGitHubData();
  }, [token, onData]);

  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">GitHub Repositories</h3>
      {profile ? (
        <>
          <p><strong>User:</strong> {profile.login}</p>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email || "N/A"}</p>

          <h4 className="mt-4 font-semibold">Top Repositories:</h4>
          <ul className="list-disc list-inside">
            {repos.map((repo) => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a> – ⭐ {repo.stargazers_count}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <button
          onClick={() => window.location.href = "/api/github/login"}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Connect GitHub
        </button>
      )}
    </div>
  );
}

export default GitHub;
