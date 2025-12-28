import { useState } from "react";
import { Group } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface GroupListProps {
  groups: Group[];
  activeGroupId: string | null;
  onGroupSelect: (group: Group) => void;
  onJoinGroup: (groupId: string) => void;
}

const GroupList = ({ groups, activeGroupId, onGroupSelect, onJoinGroup }: GroupListProps) => {
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleJoin = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    setJoiningId(groupId);
    
    // Simulate joining animation
    await new Promise((resolve) => setTimeout(resolve, 500));
    onJoinGroup(groupId);
    setJoiningId(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col border-t border-border">
      <div className="px-4 py-3 border-b border-border">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Groups
        </h4>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {groups.map((group, index) => (
          <button
            key={group.id}
            onClick={() => group.isJoined && onGroupSelect(group)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
              group.isJoined ? "hover:bg-nash-surface cursor-pointer" : "cursor-default"
            } ${
              activeGroupId === group.id
                ? "bg-primary/10 border-r-2 border-primary"
                : ""
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
              {group.icon}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-medium text-foreground truncate">{group.name}</p>
              <p className="text-xs text-muted-foreground">
                {group.memberCount} members
              </p>
            </div>
            {group.isJoined ? (
              <span className="text-xs font-medium text-nash-online flex items-center gap-1">
                <Check size={12} />
                Joined
              </span>
            ) : (
              <Button
                variant="nashOutline"
                size="sm"
                onClick={(e) => handleJoin(e, group.id)}
                disabled={joiningId === group.id}
                className="text-xs h-7 px-2"
              >
                {joiningId === group.id ? "Joining..." : "Join"}
              </Button>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
