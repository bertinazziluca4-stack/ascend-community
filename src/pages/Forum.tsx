import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  TrendingUp,
  Plus
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  thread_count: number | null;
  post_count: number | null;
}

interface Profile {
  username: string;
  display_name: string | null;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean | null;
  is_locked: boolean | null;
  upvotes: number | null;
  downvotes: number | null;
  view_count: number | null;
  reply_count: number | null;
  tags: string[] | null;
  created_at: string;
  profiles?: Profile | null;
  categories?: {
    name: string;
    color: string | null;
  } | null;
}

const iconMap: Record<string, React.ElementType> = {
  beef: Beef,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  flask: FlaskConical,
  "message-circle": MessageCircle,
};

const colorMap: Record<string, { gradient: string; iconColor: string; badge: string }> = {
  red: { 
    gradient: "from-red-500/20 to-orange-500/20", 
    iconColor: "text-red-400",
    badge: "bg-red-500/20 text-red-400"
  },
  blue: { 
    gradient: "from-blue-500/20 to-cyan-500/20", 
    iconColor: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-400"
  },
  purple: { 
    gradient: "from-purple-500/20 to-pink-500/20", 
    iconColor: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-400"
  },
  yellow: { 
    gradient: "from-yellow-500/20 to-amber-500/20", 
    iconColor: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-400"
  },
  green: { 
    gradient: "from-green-500/20 to-emerald-500/20", 
    iconColor: "text-green-400",
    badge: "bg-green-500/20 text-green-400"
  },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function Forum() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState("latest");
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchThreads();
  }, [activeTab]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    
    if (data) {
      setCategories(data);
    }
  };

  const fetchThreads = async () => {
    setLoading(true);
    
    let query = supabase
      .from("threads")
      .select(`
        *,
        categories:category_id (name, color)
      `)
      .limit(20);

    if (activeTab === "latest") {
      query = query.order("created_at", { ascending: false });
    } else if (activeTab === "hot") {
      query = query.order("upvotes", { ascending: false });
    } else if (activeTab === "top") {
      query = query.order("view_count", { ascending: false });
    }

    const { data: threadsData } = await query;
    
    if (threadsData) {
      // Fetch profiles for each thread author
      const authorIds = [...new Set(threadsData.map(t => t.author_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, display_name")
        .in("user_id", authorIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);
      
      const threadsWithProfiles = threadsData.map(thread => ({
        ...thread,
        profiles: profilesMap.get(thread.author_id) || null,
      }));
      
      setThreads(threadsWithProfiles as Thread[]);
    }
    setLoading(false);
  };

  const handleNewThread = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/forum/new");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24">
        {/* Hero Banner */}
        <section className="relative py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  <span className="text-foreground">Community </span>
                  <span className="text-gradient">Forum</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Join the discussion with thousands of like-minded individuals pursuing physical excellence.
                </p>
              </div>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-fit"
                onClick={handleNewThread}
              >
                <Plus className="w-5 h-5" />
                New Thread
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-8 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Categories</h2>
            <div className="grid gap-4">
              {categories.map((category) => {
                const colors = colorMap[category.color || "blue"];
                const Icon = iconMap[category.icon || "message-circle"] || MessageCircle;
                
                return (
                  <CategoryCard 
                    key={category.id}
                    icon={Icon}
                    name={category.name}
                    description={category.description || ""}
                    threads={category.thread_count || 0}
                    posts={category.post_count || 0}
                    color={colors.gradient}
                    iconColor={colors.iconColor}
                    slug={category.slug}
                  />
                );
              })}
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
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading threads...</p>
                    </div>
                  ) : threads.length > 0 ? (
                    threads.map((thread) => {
                      const categoryColor = colorMap[thread.categories?.color || "blue"];
                      
                      return (
                        <ThreadCard 
                          key={thread.id}
                          id={thread.id}
                          title={thread.title}
                          excerpt={thread.content.substring(0, 200) + (thread.content.length > 200 ? "..." : "")}
                          author={{
                            name: thread.profiles?.display_name || thread.profiles?.username || "Unknown",
                          }}
                          category={thread.categories?.name || "General"}
                          categoryColor={categoryColor.badge}
                          stats={{
                            replies: thread.reply_count || 0,
                            views: thread.view_count || 0,
                            upvotes: (thread.upvotes || 0) - (thread.downvotes || 0),
                          }}
                          createdAt={formatTimeAgo(thread.created_at)}
                          isPinned={thread.is_pinned || false}
                          isLocked={thread.is_locked || false}
                          isHot={(thread.upvotes || 0) > 10}
                          tags={thread.tags || []}
                        />
                      );
                    })
                  ) : (
                    <div className="text-center py-16 glass-card">
                      <MessageCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No threads yet</h3>
                      <p className="text-muted-foreground mb-6">Be the first to start a discussion!</p>
                      <Button variant="hero" onClick={handleNewThread}>
                        <Plus className="w-5 h-5" />
                        Create First Thread
                      </Button>
                    </div>
                  )}
                </div>

                {/* Load More */}
                {threads.length > 0 && (
                  <div className="mt-8 text-center">
                    <Button variant="outline" size="lg">
                      Load More Threads
                    </Button>
                  </div>
                )}
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
