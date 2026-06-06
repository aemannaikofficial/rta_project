import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Star, Send, Pencil, Check, X } from "lucide-react";

interface Props {
  contentType: string;
  contentId: string;
}

export default function RatingAndComments({ contentType, contentId }: Props) {
  const { t, isRTL } = useLanguage();
  const utils = trpc.useUtils();

  const [ratingName, setRatingName] = useState("");
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const { data: ratingData } = trpc.ratings.get.useQuery({ contentType, contentId });
  const { data: commentsList } = trpc.comments.list.useQuery({ contentType, contentId });

  const submitRating = trpc.ratings.submit.useMutation({
    onSuccess: () => {
      utils.ratings.get.invalidate({ contentType, contentId });
      setSelectedStar(0);
      setRatingName("");
    },
  });

  const createComment = trpc.comments.create.useMutation({
    onSuccess: (data) => {
      if (data.editToken) {
        const tokens = JSON.parse(localStorage.getItem("rta-comment-tokens") || "{}");
        tokens[data.id] = data.editToken;
        localStorage.setItem("rta-comment-tokens", JSON.stringify(tokens));
      }
      utils.comments.list.invalidate({ contentType, contentId });
      setCommentText("");
      setCommentName("");
    },
  });

  const updateComment = trpc.comments.update.useMutation({
    onSuccess: () => {
      utils.comments.list.invalidate({ contentType, contentId });
      setEditingId(null);
      setEditText("");
    },
  });

  const getEditToken = (commentId: number): string | null => {
    const tokens = JSON.parse(localStorage.getItem("rta-comment-tokens") || "{}");
    return tokens[commentId] || null;
  };

  return (
    <div className="mt-12 space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Rating */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-[#003B71] mb-4">{t("Rate this content", "قيّم هذا المحتوى")}</h3>
        {ratingData && ratingData.count > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(ratingData.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />)}</div>
            <span className="text-sm text-gray-500">{ratingData.average.toFixed(1)} ({ratingData.count} {t("ratings","تقييمات")})</span>
          </div>
        )}
        <div className="space-y-3">
          <input type="text" placeholder={t("Your name or Employee ID","اسمك أو الرقم الوظيفي")} value={ratingName} onChange={e => setRatingName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30" />
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)} onClick={() => setSelectedStar(s)}>
                <Star className={`w-7 h-7 transition-colors ${s <= (hoverStar || selectedStar) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <button onClick={() => { if (ratingName.trim() && selectedStar > 0) submitRating.mutate({ contentType, contentId, value: selectedStar, guestName: ratingName.trim() }); }} disabled={!ratingName.trim() || selectedStar === 0 || submitRating.isPending} className="bg-[#C8102E] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#a00d24] disabled:opacity-50 transition-colors">
            {submitRating.isPending ? t("Submitting...","جاري الإرسال...") : t("Submit Rating","إرسال التقييم")}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-[#003B71] mb-4">{t("Comments","التعليقات")} {commentsList && commentsList.length > 0 && `(${commentsList.length})`}</h3>
        <div className="space-y-3 mb-6">
          <input type="text" placeholder={t("Your name or Employee ID","اسمك أو الرقم الوظيفي")} value={commentName} onChange={e => setCommentName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30" />
          <textarea placeholder={t("Write your comment...","اكتب تعليقك...")} value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 resize-none" />
          <button onClick={() => { if (commentName.trim() && commentText.trim()) createComment.mutate({ contentType, contentId, text: commentText.trim(), userName: commentName.trim() }); }} disabled={!commentName.trim() || !commentText.trim() || createComment.isPending} className="flex items-center gap-2 bg-[#C8102E] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#a00d24] disabled:opacity-50 transition-colors">
            <Send className="w-4 h-4" />
            {createComment.isPending ? t("Posting...","جاري النشر...") : t("Post Comment","نشر التعليق")}
          </button>
        </div>
        <div className="space-y-4">
          {commentsList?.map(c => {
            const canEdit = !!getEditToken(c.id);
            const isEditing = editingId === c.id;
            return (
              <div key={c.id} className="border-b border-gray-100 pb-4 last:border-0 group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#003B71]">{c.userName || t("Anonymous","مجهول")}</span>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.updatedAt && new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime() > 1000 && (
                      <span className="text-xs text-gray-400 italic">({t("edited","معدّل")})</span>
                    )}
                  </div>
                  {canEdit && !isEditing && (
                    <button onClick={() => { setEditingId(c.id); setEditText(c.text); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#003B71] transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]/30 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => { const token = getEditToken(c.id); if (token && editText.trim()) updateComment.mutate({ id: c.id, text: editText.trim(), editToken: token }); }} disabled={updateComment.isPending} className="flex items-center gap-1 bg-[#003B71] text-white px-3 py-1 rounded text-xs hover:bg-[#002a54]">
                        <Check className="w-3 h-3" /> {t("Save","حفظ")}
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300">
                        <X className="w-3 h-3" /> {t("Cancel","إلغاء")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
                )}
              </div>
            );
          })}
          {(!commentsList || commentsList.length === 0) && (
            <p className="text-gray-400 text-sm text-center py-4">{t("No comments yet. Be the first to comment!","لا توجد تعليقات بعد. كن أول من يعلّق!")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
