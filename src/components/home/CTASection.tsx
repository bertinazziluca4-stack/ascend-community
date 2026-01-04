import { Link } from "react-router-dom";
import { ArrowRight, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-card" />
          <div className="absolute inset-0 bg-hero-gradient" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-8">
              <Dumbbell className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto">
              <span className="text-foreground">Ready to Join the </span>
              <span className="text-gradient">Elite Community?</span>
            </h2>
            
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Start your journey today. Connect with like-minded individuals, share knowledge, 
              and accelerate your path to physical excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="hero" size="xl" className="group">
                <Link to="/forum">
                  Enter the Forum
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="hero-outline" size="xl">
                <a href="#features">
                  Explore Features
                </a>
              </Button>
            </div>

            <p className="text-muted-foreground text-sm mt-8">
              Free to join • No credit card required • Instant access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
