// src/pages/PrivacyPolicy.jsx
import React from "react";

function PrivacyPolicy() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy for Cink</h1>
      <p className="mb-2">
        Cink is a dashboard app that connects user social media accounts like LinkedIn, Spotify, and Instagram.
      </p>
      <p className="mb-2">
        We collect user profile data only with explicit permission via OAuth. We never share your data with third parties.
      </p>
      <p className="mb-2">
        For questions, contact us at support@cink.vercel.app.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
