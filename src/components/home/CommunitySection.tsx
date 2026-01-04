import { Link } from "react-router-dom";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "This community transformed my understanding of nutrition. The carnivore protocol discussions here are unmatched anywhere else.",
    author: "Marcus Chen",
    role: "Carnivore 3+ years",
    avatar: "MC",
    rating: 5,
  },
  {
    quote: "Finally, a place where we can discuss optimization strategies without judgment. The knowledge sharing here is incredible.",
    author: "Sarah Williams",
    role: "Fitness Coach",
    avatar: "SW",
    rating: 5,
  },
  {
    quote: "The science-based approach and moderation quality sets this apart. This is what every fitness forum should aspire to be.",
    author: "David Park",
    role: "Strength Athlete",
    avatar: "DP",
    rating: 5,
  },
];

const topContributors = [
  { name: "Alex Rivera", posts: 1247, avatar: "AR", badge: "Elite" },
  { name: "Jordan Mills", posts: 892, avatar: "JM", badge: "Expert" },
  { name: "Casey Kim", posts: 756, avatar: "CK", badge: "Veteran" },
  { name: "Morgan Lee", posts: 634, avatar: "ML", badge: "Rising" },
];

export function CommunitySection() {
  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Testimonials */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-foreground">Trusted by </span>
              <span className="text-gradient">Thousands</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Join a community of dedicated individuals pursuing excellence in health and fitness.
            </p>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.author}
                  className="glass-card p-6 group hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                    <p className="text-foreground/90 italic pl-6">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Top Contributors */}
          <div>
            <div className="glass-card p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-foreground mb-2">Top Contributors</h3>
              <p className="text-muted-foreground mb-8">
                Our most active and valued community members
              </p>

              <div className="space-y-4 mb-8">
                {topContributors.map((contributor, index) => (
                  <div
                    key={contributor.name}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-foreground font-medium">
                        {contributor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {contributor.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {contributor.posts.toLocaleString()} contributions
                      </div>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-blue-500/20 text-blue-400' :
                        index === 2 ? 'bg-purple-500/20 text-purple-400' :
                        'bg-green-500/20 text-green-400'}
                    `}>
                      {contributor.badge}
                    </span>
                  </div>
                ))}
              </div>

              <Button asChild variant="hero" className="w-full group">
                <Link to="/forum">
                  Join the Discussion
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
