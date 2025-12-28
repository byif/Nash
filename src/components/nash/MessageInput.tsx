import { useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    console.log("📂 Selected file:", file.name, file.type);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("📡 Upload status:", res.status);

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Upload response:", data);

      // 🔥 SEND IMAGE URL AS MESSAGE
      onSendMessage(data.url);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      e.target.value = ""; // reset input
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-card">
      {/* ATTACH */}
      <Button
        variant="nashGhost"
        size="icon"
        onClick={openFilePicker}
      >
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
