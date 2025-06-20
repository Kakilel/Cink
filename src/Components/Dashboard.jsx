import React, { useContext } from "react";
import { DashboardContext } from "../Contexts/DashboardContext";

function Dashboard() {
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
        </div>
      )}
    </div>
  );
}

export default Dashboard;
