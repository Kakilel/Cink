import { useEffect, useState } from "react";
import axios from "axios";

function Github({ username = "18Mori", onData }) {
  const [data, setData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://api.github.com/users/${username}`);
        const repoRes = await axios.get(`https://api.github.com/users/${username}/repos`);
        setData(res.data);
        setRepos(repoRes.data);
        if (onData) onData({ avatar: res.data.avatar_url, username: res.data.login });
      } catch (error) {
        console.error("Failed to fetch Github data", error);
      }
    };
    fetchData();
  }, [username]);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="bg-gray-700 p-4 rounded shadow mb-8 cursor-pointer hover:bg-gray-400"
      >
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

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg p-6 w-full max-w-xl overflow-y-auto max-h-[90vh] shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">{data?.login}'s GitHub</h3>
            <div className="flex items-center mb-4">
              <img src={data?.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full border mr-4" />
              <div>
                <p><strong>Bio:</strong> {data?.bio || "No bio provided."}</p>
                <p><strong>Followers:</strong> {data?.followers}</p>
              </div>
            </div>
            <div className="grid gap-4 mt-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-500 hover:underline"
                  >
                    {repo.name}
                  </a>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {repo.description || "No description"}
                  </p>
                  <div className="flex items-center text-sm text-yellow-500">
                    ⭐ {repo.stargazers_count}
                  </div>
                </div>
              ))}
            </div>
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm text-blue-600 hover:underline"
            >
              View all repositories on GitHub →
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default Github;
