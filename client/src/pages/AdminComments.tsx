import { trpc } from "@/lib/trpc";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminComments() {
  const utils = trpc.useUtils();
  const { data: comments, isLoading } = trpc.comments.listAll.useQuery();
  const deleteComment = trpc.comments.adminDelete.useMutation({
    onSuccess: () => { utils.comments.listAll.invalidate(); toast.success("Comment deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#003B71] mb-6">Manage Comments</h1>
      {isLoading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {comments?.map(c => (
            <div key={c.id} className="flex items-start justify-between bg-white border rounded-lg p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#003B71]">{c.userName || "Anonymous"}</span>
                  <span className="text-xs text-gray-400">{c.contentType} #{c.contentId}</span>
                  <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm">{c.text}</p>
              </div>
              <button onClick={() => { if (confirm("Delete this comment?")) deleteComment.mutate({ id: c.id }); }} className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {(!comments || comments.length === 0) && <p className="text-gray-500">No comments yet.</p>}
        </div>
      )}
    </div>
  );
}
