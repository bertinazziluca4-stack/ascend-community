import { Link } from "react-router-dom";
import { ArrowRight, Users, MessageSquare, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active Members", value: "50K+", icon: Users },
  { label: "Daily Discussions", value: "2K+", icon: MessageSquare },
  { label: "Knowledge Posts", value: "500K+", icon: TrendingUp },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-glow">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow animation-delay-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 opacity-0 animate-fade-in">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Science-Based Community</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-fade-in animation-delay-100">
            <span className="text-foreground">The Future of</span>
            <br />
            <span className="text-gradient">Fitness Discussion</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in animation-delay-200">
            Join the most advanced community for carnivore enthusiasts, gym athletes, 
            biohackers, and those pursuing physical and aesthetic excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-in animation-delay-300">
            <Button asChild variant="hero" size="xl" className="group w-full sm:w-auto">
              <Link to="/forum">
                Enter the Forum
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl" className="w-full sm:w-auto">
              <Link to="/#features">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto opacity-0 animate-fade-in animation-delay-400">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card group cursor-default"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-500">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
