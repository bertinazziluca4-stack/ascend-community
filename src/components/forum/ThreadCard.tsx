import { Link } from "react-router-dom";
import { MessageSquare, ArrowUp, ArrowDown, Eye, Pin, Lock, Flame, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ThreadCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
  };
  category: string;
  categoryColor: string;
  stats: {
    replies: number;
    views: number;
    upvotes: number;
  };
  createdAt: string;
  isPinned?: boolean;
  isLocked?: boolean;
  isHot?: boolean;
  tags?: string[];
}

export function ThreadCard({
  id,
  title,
  excerpt,
  author,
  category,
  categoryColor,
  stats,
  createdAt,
  isPinned,
  isLocked,
  isHot,
  tags,
}: ThreadCardProps) {
  return (
    <Link
      to={`/forum/thread/${id}`}
      className="thread-card group block"
    >
      <div className="flex gap-4">
        {/* Vote column */}
        <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
          <button 
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-foreground">{stats.upvotes}</span>
          <button 
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {isPinned && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
            {isHot && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-400">
                <Flame className="w-3 h-3" />
                Hot
              </span>
            )}
            <Badge 
              variant="secondary" 
              className={cn("text-xs", categoryColor)}
            >
              {category}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {excerpt}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-secondary text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-medium">
                  {author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground/80">{author.name}</span>
              {author.badge && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {author.badge}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {createdAt}
            </div>
            <div className="hidden sm:flex items-center gap-3 ml-auto">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {stats.replies}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {stats.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
