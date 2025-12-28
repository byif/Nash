import { User, Group } from "@/data/mockData";
import { Search, Info, BellOff, MoreVertical, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  activeChat: User | Group | null;
  isGroup: boolean;
}

const ChatHeader = ({ activeChat, isGroup }: ChatHeaderProps) => {
  const navigate = useNavigate();
  if (!activeChat) {
    return (
      <div className="h-16 border-b border-border bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Select a conversation</p>
      </div>
    );
  }

  const isUser = "status" in activeChat;

  return (
    <div className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {isGroup ? (
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
            {(activeChat as Group).icon}
          </div>
        ) : (
          <div className="relative">
            <img
              src={(activeChat as User).avatar}
              alt={(activeChat as User).name}
              className="w-10 h-10 rounded-full bg-secondary"
            />
            {isUser && (
              <div
                className={`absolute bottom-0 right-0 ${
                  (activeChat as User).status === "online"
                    ? "nash-status-online"
                    : (activeChat as User).status === "away"
                    ? "w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-background"
                    : "nash-status-offline"
                }`}
              />
            )}
          </div>
        )}
        <div>
          <h2 className="font-semibold text-foreground">
            {isGroup ? (activeChat as Group).name : (activeChat as User).name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isGroup
              ? `${(activeChat as Group).memberCount} members`
              : (activeChat as User).status === "online"
              ? "Online"
              : (activeChat as User).status === "away"
              ? "Away"
              : `Last seen ${(activeChat as User).lastSeen || "recently"}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="nashGhost" size="icon">
          <Search size={18} />
        </Button>
        <Button variant="nashGhost" size="icon">
          <BellOff size={18} />
        </Button>
        <Button variant="nashGhost" size="icon">
          <Info size={18} />
        </Button>
        <Button
  variant="nashGhost"
  size="icon"
  onClick={() => navigate("/profile")}
>
  <Settings size={18} />
</Button>

      </div>
    </div>
  );
};


export default ChatHeader;
