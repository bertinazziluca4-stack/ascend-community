import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryCard } from "@/components/forum/CategoryCard";
import { ThreadCard } from "@/components/forum/ThreadCard";
import { ForumSidebar } from "@/components/forum/ForumSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Beef, 
  Dumbbell, 
  Sparkles, 
  FlaskConical, 
  MessageCircle,
  Search,
  Filter,
  LayoutGrid,
  List,
  Flame,
  Clock,
  TrendingUp
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const categories = [
  {
    icon: Beef,
    name: "Nutrition & Diet",
    description: "Carnivore, animal-based, ancestral nutrition, and optimal dietary strategies for performance and health.",
    threads: 12400,
    posts: 89200,
    lastPost: { title: "Raw milk sources in EU?", author: "MeatEater", time: "2m ago" },
    color: "from-red-500/20 to-orange-500/20",
    iconColor: "text-red-400",
    slug: "nutrition",
  },
  {
    icon: Dumbbell,
    name: "Training & Gym",
    description: "Strength training, hypertrophy, programming, and everything related to building muscle and performance.",
    threads: 18200,
    posts: 124500,
    lastPost: { title: "5x5 vs PPL for naturals", author: "IronMike", time: "5m ago" },
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    slug: "training",
  },
  {
    icon: Sparkles,
    name: "Looksmaxxing",
    description: "Aesthetic optimization, appearance enhancement, skincare, and self-improvement strategies.",
    threads: 8700,
    posts: 56300,
    lastPost: { title: "Mewing results 1 year", author: "JawlineKing", time: "12m ago" },
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
    slug: "looksmaxxing",
  },
  {
    icon: FlaskConical,
    name: "PEDs Discussion",
    description: "Educational harm-reduction discussions only. Research, protocols, and health monitoring.",
    threads: 6300,
    posts: 41200,
    lastPost: { title: "Bloodwork interpretation help", author: "ResearchChad", time: "18m ago" },
    color: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-400",
    slug: "peds",
  },
  {
    icon: MessageCircle,
    name: "General Discussion",
    description: "Off-topic conversations, lifestyle, motivation, success stories, and community chat.",
    threads: 24100,
    posts: 198700,
    lastPost: { title: "Morning routine optimization", author: "EarlyRiser", time: "1m ago" },
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
    slug: "general",
  },
];

const recentThreads = [
  {
    id: "1",
    title: "My 90-day carnivore transformation - before/after + bloodwork",
    excerpt: "Started this journey skeptical, now I'm a full convert. Here's everything I learned, mistakes I made, and the incredible results...",
    author: { name: "MeatKing", badge: "Elite" },
    category: "Nutrition",
    categoryColor: "bg-red-500/20 text-red-400",
    stats: { replies: 234, views: 12400, upvotes: 847 },
    createdAt: "2h ago",
    isHot: true,
    tags: ["carnivore", "transformation", "bloodwork"],
  },
  {
    id: "2",
    title: "[GUIDE] Complete beginner's hypertrophy program - science-based approach",
    excerpt: "After coaching 500+ clients, here's the program I wish I had when I started. Full periodization, exercise selection, and progression schemes...",
    author: { name: "DrStrength", badge: "Expert" },
    category: "Training",
    categoryColor: "bg-blue-500/20 text-blue-400",
    stats: { replies: 456, views: 28900, upvotes: 1203 },
    createdAt: "5h ago",
    isPinned: true,
    tags: ["guide", "hypertrophy", "beginners"],
  },
  {
    id: "3",
    title: "Sunlight protocol for testosterone optimization - my n=1 experiment",
    excerpt: "Tracked my levels for 6 months while implementing strategic sun exposure. The results are fascinating and counterintuitive...",
    author: { name: "SunBro", badge: "Veteran" },
    category: "General",
    categoryColor: "bg-green-500/20 text-green-400",
    stats: { replies: 89, views: 4500, upvotes: 234 },
    createdAt: "8h ago",
    tags: ["testosterone", "sunlight", "optimization"],
  },
  {
    id: "4",
    title: "Comprehensive guide to bone broth - recipes, benefits, and sourcing",
    excerpt: "Everything you need to know about making the perfect bone broth. From sourcing quality bones to achieving that perfect gel consistency...",
    author: { name: "ChefPrimal" },
    category: "Nutrition",
    categoryColor: "bg-red-500/20 text-red-400",
    stats: { replies: 67, views: 3200, upvotes: 178 },
    createdAt: "12h ago",
    tags: ["bonebroth", "recipes", "nutrition"],
  },
  {
    id: "5",
    title: "Cold exposure routine - from skeptic to daily practitioner",
    excerpt: "I thought cold showers were just bro science. After 3 months of consistent practice, here's what actually changed...",
    author: { name: "IceMan" },
    category: "General",
    categoryColor: "bg-green-500/20 text-green-400",
    stats: { replies: 123, views: 6700, upvotes: 312 },
    createdAt: "1d ago",
    isHot: true,
    tags: ["coldexposure", "biohacking", "hormesis"],
  },
  {
    id: "6",
    title: "Sleep optimization stack that actually works (no supplements)",
    excerpt: "After years of trying everything, these are the free behavioral changes that made the biggest difference to my sleep quality...",
    author: { name: "SleepGuru", badge: "Expert" },
    category: "General",
    categoryColor: "bg-green-500/20 text-green-400",
    stats: { replies: 201, views: 9800, upvotes: 567 },
    createdAt: "1d ago",
    tags: ["sleep", "optimization", "health"],
  },
];

export default function Forum() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("latest");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24">
        {/* Hero Banner */}
        <section className="relative py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-foreground">Community </span>
                <span className="text-gradient">Forum</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Join the discussion with thousands of like-minded individuals pursuing physical excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Categories</h2>
            <div className="grid gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.slug} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Main Forum Content */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search threads..."
                      className="pl-10 bg-card border-border"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Filter className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center rounded-lg border border-border overflow-hidden">
                      <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "p-2 transition-colors",
                          viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <List className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                          "p-2 transition-colors",
                          viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <LayoutGrid className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="bg-card border border-border">
                    <TabsTrigger value="latest" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      Latest
                    </TabsTrigger>
                    <TabsTrigger value="hot" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Flame className="w-4 h-4 mr-2" />
                      Hot
                    </TabsTrigger>
                    <TabsTrigger value="top" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Top
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Thread List */}
                <div className="space-y-4">
                  {recentThreads.map((thread) => (
                    <ThreadCard key={thread.id} {...thread} />
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg">
                    Load More Threads
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <ForumSidebar />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
