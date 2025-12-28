import { Link } from "react-router-dom";
import { MessageCircle, Users, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NashLogo from "@/components/nash/NashLogo";
import AuthBackground from "@/components/nash/AuthBackground";

const Index = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Real-Time Messaging",
      description: "Instant delivery with read receipts and typing indicators",
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create and join groups to collaborate with your team",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption keeps your conversations safe",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with modern technology stack",
    },
  ];

  return (
    <AuthBackground>
      <div className="w-full max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <NashLogo size="lg" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
              Connect. Chat.{" "}
              <span className="nash-gradient-text">Collaborate.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The modern chat platform designed for teams and individuals who
              value seamless communication and real-time collaboration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button variant="nash" size="xl" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="nashSecondary" size="xl" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="nash-card p-6 space-y-4 hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 nash-gradient rounded-xl flex items-center justify-center shadow-md">
                <feature.icon className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            © 2024 NASH. Built with modern tech for seamless communication.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Index;
