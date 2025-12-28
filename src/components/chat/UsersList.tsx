import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
};

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground px-2">
        Users
      </h3>

      {users.length === 0 && (
        <p className="text-xs text-muted-foreground px-2">
          No users yet
        </p>
      )}

      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
            {user.name?.[0] || user.email[0]}
          </div>

          {/* Name */}
          <span className="text-sm">
            {user.name || user.email}
          </span>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
