import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { Comment } from "@shared/schema";

interface CommentSectionProps {
  artifactId: string;
}

export function CommentSection({ artifactId }: CommentSectionProps) {
  const [content, setContent] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/v1/artifacts", artifactId, "comments"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/artifacts/${artifactId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (commentContent: string) => {
      return apiRequest("POST", `/api/v1/artifacts/${artifactId}/comments`, { content: commentContent });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/v1/artifacts", artifactId, "comments"] });
      toast({
        title: "Comment submitted",
        description: "Your comment has been submitted for review.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    submitMutation.mutate(content);
  };

  const approvedComments = comments?.filter((c) => c.status === "approved") || [];

  return (
    <div className="space-y-6" data-testid="comment-section">
      <h2 className="font-serif text-2xl font-semibold">Comments</h2>

      {isAuthenticated && user ? (
        <form onSubmit={handleSubmit} className="space-y-3" data-testid="comment-form">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share your thoughts about this artifact..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none min-h-[100px]"
                maxLength={1000}
                data-testid="input-comment"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {content.length}/1000 characters
                </span>
                <Button
                  type="submit"
                  disabled={!content.trim() || submitMutation.isPending}
                  data-testid="button-submit-comment"
                >
                  {submitMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <Card className="p-6 text-center" data-testid="comment-login-prompt">
          <p className="text-muted-foreground mb-3">
            Sign in to share your thoughts about this artifact
          </p>
          <a href="/signin">
            <Button data-testid="button-login-to-comment">Sign In to Comment</Button>
          </a>
        </Card>
      )}

      <div className="space-y-4" data-testid="comment-list">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))
        ) : approvedComments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8" data-testid="comment-empty">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          approvedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3" data-testid={`comment-${comment.id}`}>
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.userImage || undefined} />
                <AvatarFallback className="bg-muted">
                  {comment.userName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm" data-testid={`text-comment-author-${comment.id}`}>
                    {comment.userName || "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`text-comment-date-${comment.id}`}>
                    {comment.createdAt
                      ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                      : "Just now"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" data-testid={`text-comment-content-${comment.id}`}>
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
