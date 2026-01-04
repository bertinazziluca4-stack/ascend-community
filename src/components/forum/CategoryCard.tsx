import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  threads: number;
  posts: number;
  lastPost?: {
    title: string;
    author: string;
    time: string;
  };
  color: string;
  iconColor: string;
  slug: string;
}

export function CategoryCard({
  icon: Icon,
  name,
  description,
  threads,
  posts,
  lastPost,
  color,
  iconColor,
  slug,
}: CategoryCardProps) {
  return (
    <Link
      to={`/forum/category/${slug}`}
      className="category-card group block"
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex lg:flex-col items-center gap-4 lg:gap-1 text-center lg:w-24 shrink-0">
          <div>
            <div className="text-lg font-semibold text-foreground">{threads.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Threads</div>
          </div>
          <div className="w-px h-8 bg-border lg:hidden" />
          <div className="lg:hidden">
            <div className="text-lg font-semibold text-foreground">{posts.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
        </div>

        {/* Last Post - Hidden on mobile */}
        {lastPost && (
          <div className="hidden xl:block w-64 shrink-0 text-right">
            <div className="text-sm text-foreground truncate">{lastPost.title}</div>
            <div className="text-xs text-muted-foreground">
              by {lastPost.author} • {lastPost.time}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
