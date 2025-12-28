import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import NashLogo from "@/components/nash/NashLogo";
import UserProfile from "@/components/nash/UserProfile";
import UserList from "@/components/nash/UserList";
import ChatHeader from "@/components/nash/ChatHeader";
import ChatMessages from "@/components/nash/ChatMessages";
import MessageInput from "@/components/nash/MessageInput";

import { fetchUsers } from "@/lib/api";

/* ---------- ENV ---------- */
const API = import.meta.env.VITE_API_URL;
const WS =
  import.meta.env.VITE_WS_URL ||
  (window.location.protocol === "https:"
    ? "wss://nash-production.up.railway.app"
    : "ws://localhost:8000");

/* ---------- TYPES ---------- */
type User = {
  id: number;
  name?: string;
  email: string;
  avatar?: string;
};

type Group = {
  id: number;
  name: string;
};

type ActiveChat =
  | { type: "user"; id: number; name: string }
  | { type: "group"; id: number; name: string }
  | null;

export type Message = {
  id: string;
  content: string;
  senderId: number;
};

/* ---------- COMPONENT ---------- */
const Chat = () => {
  const navigate = useNavigate();
  const socketRef = useRef<WebSocket | null>(null);

  const currentUser: User = JSON.parse(localStorage.getItem("user") || "{}");

  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeChat, setActiveChat] = useState<ActiveChat>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [unreadUsers, setUnreadUsers] = useState<Record<number, number>>({});
  const [unreadGroups, setUnreadGroups] = useState<Record<number, number>>({});

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");

  /* ---------- DARK MODE ---------- */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  /* ---------- USERS ---------- */
  useEffect(() => {
    if (!currentUser.id) return;
    fetchUsers().then((data) =>
      setUsers(data.filter((u: User) => u.id !== currentUser.id))
    );
  }, [currentUser.id]);

  /* ---------- GROUPS ---------- */
  useEffect(() => {
    fetch(`${API}/api/auth/groups/?user_id=${currentUser.id}`)
      .then((res) => res.json())
      .then(setGroups)
      .catch(() => setGroups([]));
  }, [currentUser.id]);

  /* ---------- LOAD HISTORY ---------- */
  useEffect(() => {
    if (!activeChat) return;

    const room =
      activeChat.type === "group"
        ? `group_${activeChat.id}`
        : [currentUser.id, activeChat.id].sort().join("_");

    fetch(`${API}/api/auth/messages/${room}/`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setMessages(
          data.map((m: any) => ({
            id: m.id.toString(),
            content: m.message,
            senderId: m.sender,
          }))
        )
      );

    if (activeChat.type === "user") {
      setUnreadUsers((p) => ({ ...p, [activeChat.id]: 0 }));
    } else {
      setUnreadGroups((p) => ({ ...p, [activeChat.id]: 0 }));
    }
  }, [activeChat]);

  /* ---------- WEBSOCKET ---------- */
  useEffect(() => {
    if (!activeChat) return;

    socketRef.current?.close();

    const room =
      activeChat.type === "group"
        ? `group_${activeChat.id}`
        : [currentUser.id, activeChat.id].sort().join("_");

    const socket = new WebSocket(`${WS}/ws/chat/${room}/`);
    socketRef.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (activeChat.type === "group") {
        if (data.sender !== currentUser.id) {
          setUnreadGroups((p) => ({
            ...p,
            [activeChat.id]: (p[activeChat.id] || 0) + 1,
          }));
        }
      } else {
        if (data.sender !== currentUser.id) {
          setUnreadUsers((p) => ({
            ...p,
            [data.sender]: (p[data.sender] || 0) + 1,
          }));
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          content: data.message,
          senderId: data.sender,
        },
      ]);
    };

    return () => socket.close();
  }, [activeChat, currentUser.id]);

  /* ---------- SEND ---------- */
  const sendMessage = (content: string) => {
    if (!socketRef.current || socketRef.current.readyState !== 1) return;

    socketRef.current.send(
      JSON.stringify({
        id: Date.now().toString(),
        message: content,
        sender: currentUser.id,
      })
    );
  };

  /* ---------- CREATE GROUP ---------- */
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    const res = await fetch(`${API}/api/auth/groups/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        user_id: currentUser.id,
      }),
    });

    const group = await res.json();
    setGroups((prev) => [group, ...prev]);
    setGroupName("");
    setShowGroupModal(false);
  };

  /* ---------- UI ---------- */
  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 border-b bg-card flex justify-between px-4 items-center">
        <NashLogo size="sm" />
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun /> : <Moon />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/login")}>
            <LogOut />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-72 border-r bg-card flex flex-col">
          <UserProfile user={currentUser} />

          <UserList
            users={users}
            unreadCounts={unreadUsers}
            activeUserId={
              activeChat?.type === "user" ? activeChat.id.toString() : null
            }
            onUserSelect={(u) =>
              setActiveChat({ type: "user", id: u.id, name: u.name || u.email })
            }
          />

          <div className="border-t">
            <div className="flex justify-between items-center px-4 py-2 text-xs font-semibold">
              Groups
              <button onClick={() => setShowGroupModal(true)}>
                <Plus size={14} />
              </button>
            </div>

            {groups.map((g) => (
              <button
                key={g.id}
                className="w-full px-4 py-2 text-left hover:bg-muted flex justify-between"
                onClick={() =>
                  setActiveChat({ type: "group", id: g.id, name: g.name })
                }
              >
                {g.name}
                {unreadGroups[g.id] > 0 && (
                  <span className="bg-primary text-white rounded-full px-2 text-xs">
                    {unreadGroups[g.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <ChatHeader
            activeChat={activeChat ? { name: activeChat.name } : null}
            isGroup={activeChat?.type === "group"}
          />

          {activeChat ? (
            <>
              <ChatMessages messages={messages} currentUserId={currentUser.id} />
              <MessageInput onSendMessage={sendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              Select a chat
            </div>
          )}
        </main>
      </div>

      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl w-80">
            <h3 className="font-semibold mb-3">Create Group</h3>
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowGroupModal(false)}>Cancel</button>
              <button
                onClick={handleCreateGroup}
                className="bg-primary text-white px-4 py-1 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
