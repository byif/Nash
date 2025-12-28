import { MessageCircle } from "lucide-react";

interface NashLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const NashLogo = ({ size = "md", showText = true }: NashLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} nash-gradient rounded-xl flex items-center justify-center shadow-lg`}>
        <MessageCircle className="text-primary-foreground" size={iconSizes[size]} />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-display font-bold nash-gradient-text`}>
          NASH
        </span>
      )}
    </div>
  );
};

export default NashLogo;
