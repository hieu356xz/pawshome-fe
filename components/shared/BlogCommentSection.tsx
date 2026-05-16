"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  MessageSquare,
  Send,
  Loader2,
  Clock,
  CornerDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { blogService } from "@/services/blog.service";
import { Comment } from "@/types/post";

interface BlogCommentSectionProps {
  postId: string;
}

export function BlogCommentSection({ postId }: BlogCommentSectionProps) {
  const t = useTranslations("CommunityBoard");
  const locale = useLocale();
  const { toast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await blogService.getComments(postId);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await blogService.addComment(postId, commentContent);
      if (response.success) {
        setCommentContent("");
        toast({
          type: "success",
          message: "Comment added successfully!",
        });
        fetchComments();
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        type: "error",
        message: "Please login to comment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: locale === "vi" ? vi : enUS,
      });
    } catch (e) {
      return date;
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-foreground">
        <MessageSquare className="h-6 w-6 text-primary" />
        {t("comments")} ({comments.length})
      </h2>

      {/* Add Comment Form */}
      <form
        onSubmit={handleAddComment}
        className="bg-white rounded-[2rem] border border-border/30 p-6 shadow-sm">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={t("writeComment")}
          className="w-full min-h-[100px] bg-muted/20 border-transparent rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none outline-none text-foreground"
        />
        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl px-6 h-12 shadow-lg shadow-primary/10">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {t("addComment")}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-[2rem] border border-border/30 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {comment.user?.fullName?.charAt(0) || "U"}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-foreground">
                      {comment.user?.fullName}
                    </h4>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs font-bold text-primary flex items-center gap-1">
                    <CornerDownRight className="h-3 w-3" />
                    {t("reply")}
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-border/50">
            <p className="text-muted-foreground italic text-sm">
              {t("noComments")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
