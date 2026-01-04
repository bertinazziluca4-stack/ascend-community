import { 
  Beef, 
  Dumbbell, 
  Sparkles, 
  FlaskConical, 
  MessageCircle,
  Shield,
  Zap,
  Award,
  Users
} from "lucide-react";

const categories = [
  {
    icon: Beef,
    name: "Nutrition & Diet",
    description: "Carnivore, animal-based, and ancestral nutrition strategies",
    threads: "12.4K",
    color: "from-red-500/20 to-orange-500/20",
    iconColor: "text-red-400",
  },
  {
    icon: Dumbbell,
    name: "Training & Gym",
    description: "Strength, hypertrophy, and optimal programming",
    threads: "18.2K",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Sparkles,
    name: "Looksmaxxing",
    description: "Aesthetic optimization and appearance enhancement",
    threads: "8.7K",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: FlaskConical,
    name: "PEDs Discussion",
    description: "Educational harm-reduction discussions only",
    threads: "6.3K",
    color: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: MessageCircle,
    name: "General Discussion",
    description: "Off-topic, lifestyle, and community chat",
    threads: "24.1K",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Knowledge",
    description: "Science-backed discussions with expert moderation",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant notifications and live thread updates",
  },
  {
    icon: Award,
    title: "Reputation System",
    description: "Earn trust and badges through quality contributions",
  },
  {
    icon: Users,
    title: "Elite Community",
    description: "Connect with serious practitioners and experts",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Explore Our </span>
            <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Dive into focused discussions across every aspect of physical optimization
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="category-card group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center ${category.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {category.threads} threads
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
