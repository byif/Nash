import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.id;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8000/api/auth/profile/?user_id=${userId}`
    )
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setBio(data.bio || "");
        setPreview(data.avatar);
      });
  }, [userId]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    const res = await fetch(
      "http://127.0.0.1:8000/api/auth/profile/update/",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      alert("Failed to update profile");
      return;
    }

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
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-card rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <div className="flex justify-center mb-4">
        <label className="cursor-pointer">
          <img
            src={preview || "/placeholder.svg"}
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setAvatar(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        placeholder="Name"
      />

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Bio"
      />

      <button
        onClick={handleSave}
        className="w-full bg-primary text-white py-2 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Profile;
