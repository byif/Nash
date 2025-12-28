import { useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------- ENV ---------- */
const API = import.meta.env.VITE_API_URL;

type Props = {
  onSendMessage: (content: string) => void;
};

const MessageInput = ({ onSendMessage }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------- SEND TEXT ---------- */
  const handleSend = () => {
    const value = inputRef.current?.value.trim();
    if (!value) return;

    onSendMessage(value);
    inputRef.current!.value = "";
  };

  /* ---------- OPEN FILE PICKER ---------- */
  const openFilePicker = () => {
    fileRef.current?.click();
  };

  /* ---------- HANDLE FILE UPLOAD ---------- */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}/api/auth/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();

      // 🔥 SEND FILE URL AS MESSAGE
      onSendMessage(data.url);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("File upload failed");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-card">
      {/* ATTACH */}
      <Button variant="nashGhost" size="icon" onClick={openFilePicker}>
        <Paperclip size={18} />
      </Button>

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
      />

      {/* TEXT INPUT */}
      <input
        ref={inputRef}
        placeholder="Message in NASH..."
        className="flex-1 px-4 py-2 rounded-full border outline-none"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      {/* SEND */}
      <Button variant="nash" size="icon" onClick={handleSend}>
        <Send size={18} />
      </Button>
    </div>
  );
};

export default MessageInput;
