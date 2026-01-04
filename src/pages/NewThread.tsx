import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, X, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect } from "react";

const threadSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  content: z.string()
    .min(20, "Content must be at least 20 characters")
    .max(50000, "Content must be less than 50,000 characters"),
  category_id: z.string().min(1, "Please select a category"),
});

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewThread() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");
    
    if (data) {
      setCategories(data);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = threadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a thread");
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("threads")
        .insert({
          title: formData.title,
          content: formData.content,
          category_id: formData.category_id,
          author_id: user.id,
          tags: tags,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Thread created successfully!");
      navigate(`/forum/thread/${data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create thread");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/forum")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Thread</h1>
            <p className="text-muted-foreground">Start a new discussion with the community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-sm text-destructive">{errors.category_id}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title for your thread"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-card border-border"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-foreground">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your thread content here. Markdown is supported..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-card border-border min-h-[300px] resize-y"
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.content.length}/50,000 characters
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-foreground">Tags (optional)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {tags.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="bg-card border-border flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Add up to 5 tags to help others find your thread
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/forum")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Thread"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
