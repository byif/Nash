import { User } from "@/data/mockData";

interface UserListProps {
  users: User[];
  activeUserId: string | null;
  unreadCounts: Record<number, number>; // 🔥 ADD THIS
  onUserSelect: (user: User) => void;
}

const UserList = ({
  users,
  activeUserId,
  unreadCounts,
  onUserSelect,
}: UserListProps) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Users
        </h4>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {users.map((user, index) => {
          const unread = unreadCounts[user.id] || 0;

          return (
            <button
              key={user.id}
              onClick={() => onUserSelect(user)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-nash-surface ${
                activeUserId === user.id.toString()
                  ? "bg-primary/10 border-r-2 border-primary"
                  : ""
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* AVATAR + STATUS */}
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full bg-secondary object-cover"
                />

                <div
                  className={`absolute bottom-0 right-0 ${
                    user.status === "online"
                      ? "nash-status-online"
                      : user.status === "away"
                      ? "w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-background"
                      : "nash-status-offline"
                  }`}
                />

                {/* 🔴 UNREAD BADGE */}
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unread}
                  </span>
                )}
              </div>

              {/* NAME + LAST SEEN */}
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-foreground truncate">
                  {user.name}
                </p>

                {user.status === "offline" && user.lastSeen && (
                  <p className="text-xs text-muted-foreground truncate">
                    Last seen {user.lastSeen}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
