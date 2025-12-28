const TypingIndicator = ({ userName }: { userName: string }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 animate-fade-in">
      <div className="flex gap-1">
        <div className="nash-typing-dot" />
        <div className="nash-typing-dot" />
        <div className="nash-typing-dot" />
      </div>
      <span className="text-sm text-muted-foreground">
        {userName} is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;
