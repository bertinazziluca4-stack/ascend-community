import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Award, Bell, Bookmark, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const trendingTopics = [
  { tag: "carnivore30", posts: 234 },
  { tag: "bulkseason", posts: 189 },
  { tag: "sunexposure", posts: 156 },
  { tag: "rawmilk", posts: 142 },
  { tag: "coldplunge", posts: 128 },
];

const onlineMembers = [
  { name: "Alex R.", avatar: "AR", status: "online" },
  { name: "Jordan M.", avatar: "JM", status: "online" },
  { name: "Casey K.", avatar: "CK", status: "online" },
  { name: "Morgan L.", avatar: "ML", status: "away" },
  { name: "Taylor S.", avatar: "TS", status: "online" },
];

export function ForumSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNewThread = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/forum/new");
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* New Thread Button */}
      <Button variant="hero" className="w-full group" onClick={handleNewThread}>
        <Plus className="w-5 h-5" />
        New Thread
      </Button>

      {/* Quick Links */}
      <div className="glass-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Quick Access</h3>
        <nav className="space-y-1">
          {[
            { icon: TrendingUp, label: "Trending", href: "#" },
            { icon: Bell, label: "Notifications", href: "#", badge: user ? 3 : undefined },
            { icon: Bookmark, label: "Bookmarks", href: "#" },
            { icon: Award, label: "Leaderboard", href: "#" },
            { icon: Settings, label: "Settings", href: "#" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (!user && (item.label === "Notifications" || item.label === "Bookmarks" || item.label === "Settings")) {
                  navigate("/auth");
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full text-left"
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Trending Topics */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Trending Topics</h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <button
              key={topic.tag}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors group w-full text-left"
            >
              <span className="text-muted-foreground text-sm font-medium w-5">
                {index + 1}
              </span>
              <span className="flex-1 text-foreground group-hover:text-primary transition-colors">
                #{topic.tag}
              </span>
              <span className="text-xs text-muted-foreground">
                {topic.posts} posts
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Online Members */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Online Now</h3>
          <span className="text-xs text-muted-foreground ml-auto">247 online</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {onlineMembers.map((member) => (
            <div key={member.name} className="relative group">
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarFallback className="bg-secondary text-foreground text-xs font-medium group-hover:bg-primary/20 transition-colors">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                  member.status === "online" ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
            </div>
          ))}
          <button className="w-10 h-10 rounded-full bg-secondary text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-center text-sm font-medium">
            +42
          </button>
        </div>
      </div>

      {/* Forum Stats */}
      <div className="glass-card p-4">
        <h3 className="font-semibold text-foreground mb-4">Forum Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Members", value: "52.4K" },
            { label: "Threads", value: "89.2K" },
            { label: "Posts", value: "1.2M" },
            { label: "Online", value: "247" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
