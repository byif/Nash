import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  user: {
    id: number;
    name?: string;
    email: string;
    avatar?: string;
  };
};

const UserProfile = ({ user }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 p-4 border-b">
      {/* PROFILE IMAGE */}
      <img
        src={user.avatar || "/placeholder.svg"}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* NAME + SETTINGS */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">
            {user.name || user.email}
          </span>

          {/* ⚙️ SETTINGS */}
          <button
            onClick={() => navigate("/profile")}
            className="text-muted-foreground hover:text-primary"
            title="Edit Profile"
          >
            <Settings size={16} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">Online</p>
      </div>
    </div>
  );
};

export default UserProfile;
