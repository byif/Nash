export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  lastSeen?: string;
}

export interface Group {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  isJoined: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isSystemMessage?: boolean;
}

export const currentUser: User = {
  id: "current",
  name: "Alex Morgan",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  status: "online",
};

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    status: "online",
  },
  {
    id: "2",
    name: "Mike Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    status: "online",
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    status: "away",
  },
  {
    id: "4",
    name: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    status: "offline",
    lastSeen: "2 hours ago",
  },
  {
    id: "5",
    name: "Lisa Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    status: "online",
  },
  {
    id: "6",
    name: "David Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    status: "offline",
    lastSeen: "5 hours ago",
  },
];

export const mockGroups: Group[] = [
  {
    id: "g1",
    name: "General",
    icon: "💬",
    memberCount: 128,
    isJoined: true,
  },
  {
    id: "g2",
    name: "Design Team",
    icon: "🎨",
    memberCount: 24,
    isJoined: true,
  },
  {
    id: "g3",
    name: "Engineering",
    icon: "⚙️",
    memberCount: 56,
    isJoined: false,
  },
  {
    id: "g4",
    name: "Marketing",
    icon: "📢",
    memberCount: 18,
    isJoined: false,
  },
  {
    id: "g5",
    name: "Product",
    icon: "🚀",
    memberCount: 32,
    isJoined: true,
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      senderName: "Sarah Chen",
      content: "Hey! How's the new project coming along?",
      timestamp: "10:30 AM",
      status: "read",
    },
    {
      id: "m2",
      senderId: "current",
      senderName: "You",
      content: "Going great! Just finished the initial design phase.",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: "m3",
      senderId: "1",
      senderName: "Sarah Chen",
      content: "That's awesome! Can you share the designs with me?",
      timestamp: "10:33 AM",
      status: "read",
    },
    {
      id: "m4",
      senderId: "current",
      senderName: "You",
      content: "Sure! I'll send them over in a bit. Just making some final touches.",
      timestamp: "10:35 AM",
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "m5",
      senderId: "2",
      senderName: "Mike Johnson",
      content: "Did you see the latest updates?",
      timestamp: "9:15 AM",
      status: "read",
    },
    {
      id: "m6",
      senderId: "current",
      senderName: "You",
      content: "Not yet! What's new?",
      timestamp: "9:20 AM",
      status: "read",
    },
  ],
  "g1": [
    {
      id: "gm1",
      senderId: "system",
      senderName: "System",
      content: "Welcome to General! 👋",
      timestamp: "Yesterday",
      status: "read",
      isSystemMessage: true,
    },
    {
      id: "gm2",
      senderId: "1",
      senderName: "Sarah Chen",
      content: "Good morning everyone! Ready for the standup?",
      timestamp: "9:00 AM",
      status: "read",
    },
    {
      id: "gm3",
      senderId: "2",
      senderName: "Mike Johnson",
      content: "Ready! Let's do this 💪",
      timestamp: "9:01 AM",
      status: "read",
    },
    {
      id: "gm4",
      senderId: "current",
      senderName: "You",
      content: "Count me in!",
      timestamp: "9:02 AM",
      status: "read",
    },
  ],
  "g2": [
    {
      id: "gm5",
      senderId: "system",
      senderName: "System",
      content: "You joined Design Team",
      timestamp: "Last week",
      status: "read",
      isSystemMessage: true,
    },
    {
      id: "gm6",
      senderId: "3",
      senderName: "Emily Davis",
      content: "Sharing the new mockups in the files section!",
      timestamp: "11:00 AM",
      status: "read",
    },
  ],
};
