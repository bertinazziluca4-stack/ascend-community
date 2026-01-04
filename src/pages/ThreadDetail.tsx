import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Eye, 
  Bookmark, 
  Share2, 
  Flag,
  Clock,
  Loader2,
  Send
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  username: string;
  display_name: string | null;
  reputation: number | null;
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
    slug: string;
    color: string | null;
  } | null;
}

interface Comment {
  id: string;
  content: string;
  author_id: string;
  thread_id: string;
  parent_id: string | null;
  upvotes: number | null;
  downvotes: number | null;
  created_at: string;
  profiles?: Profile | null;
}

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

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userVote, setUserVote] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchThread();
      fetchComments();
      if (user) {
        fetchUserVote();
      }
    }
  }, [id, user]);

  const fetchThread = async () => {
    const { data: threadData, error } = await supabase
      .from("threads")
      .select(`
        *,
        categories:category_id (name, slug, color)
      `)
      .eq("id", id)
      .single();

    if (error || !threadData) {
      toast.error("Thread not found");
      navigate("/forum");
      return;
    }

    // Fetch author profile separately
    const { data: profileData } = await supabase
      .from("profiles")
      .select("username, display_name, reputation")
      .eq("user_id", threadData.author_id)
      .single();

    const threadWithProfile: Thread = {
      ...threadData,
      profiles: profileData || null,
    };

    setThread(threadWithProfile);
    setLoading(false);

    // Increment view count
    await supabase
      .from("threads")
      .update({ view_count: (threadData.view_count || 0) + 1 })
      .eq("id", id);
  };

  const fetchComments = async () => {
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("thread_id", id)
      .order("created_at", { ascending: true });

    if (commentsData && commentsData.length > 0) {
      // Fetch profiles for all comment authors
      const authorIds = [...new Set(commentsData.map(c => c.author_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, reputation")
        .in("user_id", authorIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      const commentsWithProfiles: Comment[] = commentsData.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.author_id) || null,
      }));

      setComments(commentsWithProfiles);
    }
  };

  const fetchUserVote = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("votes")
      .select("vote_type")
      .eq("user_id", user.id)
      .eq("thread_id", id)
      .single();

    if (data) {
      setUserVote(data.vote_type);
    }
  };

  const handleVote = async (voteType: number) => {
    if (!user) {
      toast.error("Please sign in to vote");
      navigate("/auth");
      return;
    }

    if (!thread) return;

    try {
      if (userVote === voteType) {
        // Remove vote
        await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("thread_id", id);
        
        // Update thread vote count
        const field = voteType === 1 ? "upvotes" : "downvotes";
        await supabase
          .from("threads")
          .update({ [field]: Math.max((thread[field] || 0) - 1, 0) })
          .eq("id", id);
        
        setUserVote(null);
        setThread(prev => prev ? { ...prev, [field]: Math.max((prev[field] || 0) - 1, 0) } : null);
      } else {
        // Add or change vote
        const { error } = await supabase
          .from("votes")
          .upsert({
            user_id: user.id,
            thread_id: id,
            vote_type: voteType,
          });

        if (error) throw error;

        // Update thread vote counts
        if (userVote !== null) {
          // Changing vote
          const oldField = userVote === 1 ? "upvotes" : "downvotes";
          const newField = voteType === 1 ? "upvotes" : "downvotes";
          
          await supabase
            .from("threads")
            .update({ 
              [oldField]: Math.max((thread[oldField as keyof Thread] as number || 0) - 1, 0),
              [newField]: (thread[newField as keyof Thread] as number || 0) + 1,
            })
            .eq("id", id);

          setThread(prev => prev ? { 
            ...prev, 
            [oldField]: Math.max((prev[oldField as keyof Thread] as number || 0) - 1, 0),
            [newField]: (prev[newField as keyof Thread] as number || 0) + 1,
          } : null);
        } else {
          // New vote
          const field = voteType === 1 ? "upvotes" : "downvotes";
          await supabase
            .from("threads")
            .update({ [field]: (thread[field] || 0) + 1 })
            .eq("id", id);

          setThread(prev => prev ? { ...prev, [field]: (prev[field] || 0) + 1 } : null);
        }

        setUserVote(voteType);
      }
    } catch (error: any) {
      toast.error("Failed to vote");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to comment");
      navigate("/auth");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmitting(true);

    try {
      const { data: commentData, error } = await supabase
        .from("comments")
        .insert({
          content: newComment.trim(),
          author_id: user.id,
          thread_id: id,
        })
        .select("*")
        .single();

      if (error) throw error;

      // Fetch the author's profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, display_name, reputation")
        .eq("user_id", user.id)
        .single();

      const newCommentWithProfile: Comment = {
        ...commentData,
        profiles: profileData || null,
      };

      setComments(prev => [...prev, newCommentWithProfile]);
      setNewComment("");
      toast.success("Comment posted!");

      // Update reply count
      await supabase
        .from("threads")
        .update({ reply_count: (thread?.reply_count || 0) + 1 })
        .eq("id", id);

      setThread(prev => prev ? { ...prev, reply_count: (prev.reply_count || 0) + 1 } : null);
    } catch (error: any) {
      toast.error(error.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading thread...</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return null;
  }

  const voteScore = (thread.upvotes || 0) - (thread.downvotes || 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/forum")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>

          {/* Thread */}
          <article className="glass-card p-6 mb-8">
            <div className="flex gap-4">
              {/* Vote column */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button 
                  onClick={() => handleVote(1)}
                  className={`p-2 rounded-lg transition-colors ${
                    userVote === 1 
                      ? "text-primary bg-primary/20" 
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <span className={`text-lg font-bold ${voteScore > 0 ? "text-primary" : voteScore < 0 ? "text-destructive" : "text-foreground"}`}>
                  {voteScore}
                </span>
                <button 
                  onClick={() => handleVote(-1)}
                  className={`p-2 rounded-lg transition-colors ${
                    userVote === -1 
                      ? "text-destructive bg-destructive/20" 
                      : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  }`}
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">
                    {thread.categories?.name}
                  </Badge>
                  {thread.is_pinned && (
                    <Badge variant="outline" className="text-primary border-primary">Pinned</Badge>
                  )}
                  {thread.is_locked && (
                    <Badge variant="outline" className="text-muted-foreground">Locked</Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {thread.title}
                </h1>

                {/* Author info */}
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-medium">
                      {thread.profiles?.username?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-foreground">
                      {thread.profiles?.display_name || thread.profiles?.username}
                    </span>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(thread.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {thread.view_count?.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {thread.content}
                  </p>
                </div>

                {/* Tags */}
                {thread.tags && thread.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-full bg-secondary text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {comments.length} {comments.length === 1 ? "Reply" : "Replies"}
            </h2>

            {/* Comment Form */}
            {!thread.is_locked && (
              <form onSubmit={handleSubmitComment} className="glass-card p-4 mb-6">
                <Textarea
                  placeholder={user ? "Write your reply..." : "Sign in to reply"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!user}
                  className="bg-card border-border min-h-[100px] mb-4"
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    variant="hero"
                    disabled={!user || submitting || !newComment.trim()}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Reply
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="glass-card p-4">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                        {comment.profiles?.username?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-foreground">
                          {comment.profiles?.display_name || comment.profiles?.username}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-foreground/90 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <ArrowUp className="w-4 h-4" />
                          {(comment.upvotes || 0) - (comment.downvotes || 0)}
                        </button>
                        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No replies yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
