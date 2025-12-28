import { Message } from "@/pages/Chat";

type Props = {
  messages: Message[];
  currentUserId: number;
};

const ChatMessages = ({ messages, currentUserId }: Props) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        if (!msg || !msg.content) return null; // 🛡️ SAFETY

        const isMine = msg.senderId === currentUserId;

        const isImage =
          msg.content.startsWith("http") &&
          /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.content);

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm
              ${isMine ? "bg-primary text-white" : "bg-muted"}`}
            >
              {isImage ? (
                <img
                  src={msg.content}
                  alt="uploaded"
                  className="rounded-md max-w-full"
                  onError={() =>
                    console.error("❌ Image failed to load:", msg.content)
                  }
                />
              ) : msg.content.startsWith("http") ? (
                <a
                  href={msg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  📎 Download file
                </a>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
