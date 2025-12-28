import { Message } from "@/pages/Chat";

type Props = {
  messages: Message[];
  currentUserId: number;
};

const ChatMessages = ({ messages, currentUserId }: Props) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.content);

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-xs px-3 py-2 rounded-lg text-sm break-words
                ${isMine ? "bg-primary text-white" : "bg-muted text-foreground"}
              `}
            >
              {/* IMAGE */}
              {isImage ? (
                <img
                  src={msg.content}
                  alt="Shared media"
                  className="rounded-md max-w-full"
                />
              ) : 
              /* FILE LINK */
              msg.content.startsWith("http") ? (
                <a
                  href={msg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500"
                >
                  📎 Download file
                </a>
              ) : (
                /* TEXT MESSAGE */
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
