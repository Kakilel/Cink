// Updated Dashboard with Spotify and Discord modals
import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../Contexts/DashboardContext";
import Spotify from "./Spotify";
import Discord from "./Discord";
import Instagram from "./Instagram";
import LinkedIn from "./LinkedIn";
import Reddit from "./Reddit";
import Tiktok from "./Tiktok";
import Twitter from "./Twitter";
import Github from "./Github";

import { FaSpotify, FaDiscord, FaInstagram, FaLinkedin, FaGithub, FaTwitter, FaReddit, FaTiktok, FaSun, FaMoon,} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(DashboardContext);
  const [platformData, setPlatformData] = useState({});
  const [showPrompt, setShowPrompt] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "light" ? false : true;
  });
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);

  const handleData = (platform, data) => {
    setPlatformData((prev) => ({ ...prev, [platform]: data }));
  };

  const handlePlatformLogin = (platform) => {
    setShowPrompt(false);
    const redirect = encodeURIComponent(process.env.REACT_APP_IG_REDIRECT_URI);
    const urls = {
      spotify: "/api/spotify/login",
      discord: "/api/discord/login",
      instagram: `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.REACT_APP_IG_CLIENT_ID}&redirect_uri=${redirect}&scope=instagram_basic,instagram_graph_user_media&response_type=code`,
      linkedin: "/api/linkedin/login",
      github: "/api/github/login",
      twitter: "/api/twitter/login",
      reddit: "/api/reddit/login",
      tiktok: "/api/tiktok/login",
    };
    if (urls[platform]) window.location.href = urls[platform];
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const platformList = [
    { name: "spotify", icon: <FaSpotify className="mr-2" /> },
    { name: "discord", icon: <FaDiscord className="mr-2" /> },
    { name: "instagram", icon: <FaInstagram className="mr-2" /> },
    { name: "linkedin", icon: <FaLinkedin className="mr-2" /> },
    { name: "github", icon: <FaGithub className="mr-2" /> },
    { name: "twitter", icon: <FaTwitter className="mr-2" /> },
    { name: "reddit", icon: <FaReddit className="mr-2" /> },
    { name: "tiktok", icon: <FaTiktok className="mr-2" /> },
  ];

  return (
    <div className={`transition-colors duration-500 min-h-screen p-6 max-w-6x1  ${darkMode ? "bg-bg-100 text-text-100" : "bg-light-bg-100 text-light-text-100"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-4xl font-bold bg-clip-text text-transparent ${darkMode ? "bg-gradient-to-r from-primary-100 to-primary-300" : "bg-gradient-to-r from-light-primary-100 to-light-primary-300"}`}>
          Cink
        </h1>
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          whileTap={{ scale: 0.85 }}
          whileHover={{ rotate: 10 }}
          className={`p-2 rounded-full ${darkMode ? "bg-bg-300 text-text-100" : "bg-light-bg-300 text-light-text-100"}`}
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait" initial={false}>
            {darkMode ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <FaSun className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <FaMoon className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* User Info */}
      {user && (
        <motion.div layout className={`mb-8 p-6 rounded-2xl shadow-xl ${darkMode ? "bg-bg-200" : "bg-light-bg-200"}`}>
          <h2 className="text-2xl font-semibold mb-1">Welcome, {user.displayName || "User"}</h2>
          <p className={darkMode ? "text-text-200" : "text-light-text-200"}>{user.email}</p>
        </motion.div>
      )}

      {/* Add Platform Button */}
      <div className="mb-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPrompt(true)}
          className={`px-6 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 ${darkMode ? "bg-primary-200 hover:bg-primary-300 text-text-100" : "bg-light-primary-200 hover:bg-light-primary-300 text-light-text-100"}`}
        >
          + Add Platform
        </motion.button>
      </div>

      {/* Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-10 p-6 rounded-2xl shadow-lg ${darkMode ? "bg-bg-200" : "bg-light-bg-200"}`}
          >
            <p className="font-semibold mb-4 text-xl">Select a platform to connect:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platformList.map(({ name, icon }) => (
                <motion.button
                  whileHover={!platformData[name] && { scale: 1.05 }}
                  whileTap={!platformData[name] && { scale: 0.95 }}
                  key={name}
                  onClick={() => handlePlatformLogin(name)}
                  disabled={platformData[name]}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                    platformData[name]
                      ? darkMode
                        ? "bg-bg-300 text-text-200 cursor-not-allowed"
                        : "bg-light-bg-300 text-light-text-200 cursor-not-allowed"
                      : darkMode
                      ? "bg-accent-100 hover:bg-accent-200 text-text-100"
                      : "bg-light-accent-100 hover:bg-light-accent-200 text-light-text-100"
                  }`}
                >
                  {icon}
                  <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Cards */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Object.entries(platformData).map(([platform, data]) => (
          <motion.div
            key={platform}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              if (platform === "github") setShowGithubModal(true);
              else if (platform === "spotify") setShowSpotifyModal(true);
              else if (platform === "discord") setShowDiscordModal(true);
            }}
            className={`cursor-pointer p-4 rounded-2xl shadow-lg text-center hover:scale-[1.02] transition-transform duration-200 ${
              darkMode ? "bg-bg-300" : "bg-light-bg-300"
            }`}
          >
            {data.avatar && (
              <img
                src={data.avatar}
                alt={platform}
                className="w-16 h-16 rounded-full mx-auto mb-2 border border-white/20"
              />
            )}
            <h4 className="text-lg font-semibold capitalize">{platform}</h4>
            <p className={darkMode ? "text-text-200" : "text-light-text-200"}>
              {data.username || "Connected"}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* GitHub Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-bg-300 p-6 rounded-2xl shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-4 right-6 text-xl font-bold"
              onClick={() => setShowGithubModal(false)}
            >
              ×
            </button>
            <Github username={platformData.github?.username} />
          </div>
        </div>
      )}

      {/* Spotify Modal */}
      {showSpotifyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-bg-300 p-6 rounded-2xl shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-4 right-6 text-xl font-bold"
              onClick={() => setShowSpotifyModal(false)}
            >
              ×
            </button>
            <Spotify user={user} onData={(d) => handleData("spotify", d)} />
          </div>
        </div>
      )}

      {/* Discord Modal */}
      {showDiscordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-bg-300 p-6 rounded-2xl shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-4 right-6 text-xl font-bold"
              onClick={() => setShowDiscordModal(false)}
            >
              ×
            </button>
            <Discord user={user} onData={(d) => handleData("discord", d)} />
          </div>
        </div>
      )}

      {/* Hidden Platform Components */}
      <div className="hidden">
        <Spotify user={user} onData={(d) => handleData("spotify", d)} />
        <Discord user={user} onData={(d) => handleData("discord", d)} />
        <Instagram user={user} onData={(d) => handleData("instagram", d)} />
        <LinkedIn user={user} onData={(d) => handleData("linkedin", d)} />
        <Github user={user} onData={(d) => handleData("github", d)} />
        <Twitter user={user} onData={(d) => handleData("twitter", d)} />
        <Reddit user={user} onData={(d) => handleData("reddit", d)} />
        <Tiktok user={user} onData={(d) => handleData("tiktok", d)} />
      </div>
    </div>
  );
}

export default Dashboard;
