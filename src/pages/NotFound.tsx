import { Link } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '200ms' }} />

      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-8">
          <Dumbbell className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-8xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Looks like you've wandered off the path. Don't worry, even the best athletes miss a rep sometimes.
        </p>
        
        <Button asChild variant="hero" size="lg" className="group">
          <Link to="/">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
