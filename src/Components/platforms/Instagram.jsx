// src/Components/platforms/Instagram.jsx
import axios from "axios";

function Instagram({ platformData, loginWithInstagram }) {
  const instagram = platformData?.instagram;

  return (
    <div className="mb-8 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Instagram Status</h3>
      {instagram ? (
        <div className="space-y-2">
          <p><strong>Username:</strong> {instagram.username}</p>
          <p><strong>Account Type:</strong> {instagram.account_type}</p>
          <p><strong>Media Count:</strong> {instagram.media_count}</p>
          <p><strong>Followers:</strong> {instagram.followers_count || "N/A"}</p>
          <p><strong>Likes:</strong> {instagram.likes_count || "N/A"}</p>
          <p><strong>Comments:</strong> {instagram.comments_count || "N/A"}</p>
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
  );
}

export default Instagram;