import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/config";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.id;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD PROFILE ---------- */
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE}/api/auth/profile/?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setName(data.name || "");
        setBio(data.bio || "");
        setPreview(data.avatar || null);
      })
      .catch((err) => {
        console.error("Profile load error:", err);
        alert("Failed to load profile");
      });
  }, [userId]);

  /* ---------- SAVE PROFILE ---------- */
  const handleSave = async () => {
    if (!userId) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", String(userId));
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/profile/update/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name,
          avatar: preview,
        })
      );

      navigate("/chat", { replace: true });
      window.location.reload();
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      {/* AVATAR */}
      <div className="flex justify-center mb-4">
        <label className="cursor-pointer">
          <img
            src={preview || "/placeholder.svg"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setAvatar(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      {/* NAME */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="Name"
      />

      {/* BIO */}
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Bio"
      />

      {/* SAVE */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default Profile;
