import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../Contexts/DashboardContext";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdEmail } from "react-icons/md";

function Profile() {
  const navigate = useNavigate();
  const { user, socialAccounts, dispatch } = useContext(DashboardContext);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const providerIcons = {
    facebook: <FontAwesomeIcon icon="fa-brands fa-facebook" />,
    instagram: <FontAwesomeIcon icon="fa-brands fa-instagram" />,
    x: <FontAwesomeIcon icon="fa-brands fa-x-twitter" />,
    tiktok: <FontAwesomeIcon icon="fa-brands fa-tiktok" />,
    github: <FontAwesomeIcon icon="fa-brands fa-github" />,
    spotify: <FontAwesomeIcon icon="fa-brands fa-spotify" />,
    password: {
      icon: <MdEmail className="text-gray-600 mr-2" />,
      label: "Email/Password",
    },
  };
  const fallbackURL =
    "https://ui-avatars.com/api/?name=User&background=cccccc&color=000000&rounded=true";
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhoto(user.photoURL || "");
      const providers = user.providerData.map((profile) => profile.providerId);
      dispatch({ type: "SET_SOCIAL_ACCOUNTS", payload: providers });
      setLoading(false);
    }
  }, [user, dispatch]);

  const handleImageUpload = async () => {
    if (!newImage || !user) return photo;
    const fileRef = ref(storage, `profile_pictures/${user.uid}`);
    await uploadBytes(fileRef, newImage);
    const url = await getDownloadURL(fileRef);
    return url;
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const uploadedURL = await handleImageUpload();
      await updateProfile(user, {
        displayName: name,
        photoURL: uploadedURL || photo,
      });
      dispatch({
        type: "SET_USER",
        payload: { ...user, displayName: name, photoURL: uploadedURL || photo },
      });
      setPhoto(uploadedURL || photo);
      setMessage("Profile updated successfully.");
      setEditMode(false);
    } catch (error) {
      console.error(error);
      setMessage(" Failed to update profile.");
    }
    setSaving(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No user is currently logged in.</p>;

  return (
    <>
      <h2>Profile</h2>
      {message && <p>{message}</p>}

      <div>
        <img
          src={photo || fallbackURL}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackURL;
          }}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>
          {editMode ? (
            <>
              <div>
                <label>Name:</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label>Upload New Photo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                />
              </div>

              <div>
                <button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {user.displayName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <div>
                <strong>Connected via:</strong>
                <ul className="mt-2 space-y-1">
                  {socialAccounts.map((providerId, idx) => {
                    const info = providerIcons[providerId] || {
                      icon: null,
                      label: providerId,
                    };
                    return (
                      <li key={idx} className="flex items-center gap-2">
                        {info.icon}
                        <span>{info.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button onClick={() => setEditMode(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
export default Profile