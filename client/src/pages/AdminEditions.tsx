import { trpc } from "@/lib/trpc";
import { Newspaper, Eye, Calendar, FileText, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const newsletterSchema = z.object({
  titleEn: z.string().min(1, "Title (EN) is required"),
  titleAr: z.string().min(1, "Title (AR) is required"),
  contentEn: z.string().min(1, "Content (EN) is required"),
  contentAr: z.string().min(1, "Content (AR) is required"),
  issueNumber: z.string().optional(),
  publishDate: z.string().optional(),
  pdfUrl: z.string().optional(),
  published: z.boolean().default(false),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function AdminEditions() {
  const utils = trpc.useUtils();
  const { data: newsletters, isLoading } = trpc.newsletters.adminList.useQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema) as any,
    defaultValues: {
      titleEn: "", titleAr: "", contentEn: "", contentAr: "",
      issueNumber: "", publishDate: "", pdfUrl: "", published: false,
    },
  });

  const createNewsletter = trpc.newsletters.create.useMutation({
    onSuccess: () => {
      utils.newsletters.invalidate();
      toast.success("Edition created");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateNewsletter = trpc.newsletters.update.useMutation({
    onSuccess: () => {
      utils.newsletters.invalidate();
      toast.success("Edition updated");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteNewsletter = trpc.newsletters.delete.useMutation({
    onSuccess: () => { utils.newsletters.invalidate(); toast.success("Edition deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  function onSubmit(data: NewsletterFormValues) {
    if (editingId) {
      updateNewsletter.mutate({ id: editingId, ...data });
    } else {
      createNewsletter.mutate(data);
    }
  }

  function handleEdit(newsletter: any) {
    form.reset({
      titleEn: newsletter.titleEn,
      titleAr: newsletter.titleAr,
      contentEn: newsletter.contentEn || "",
      contentAr: newsletter.contentAr || "",
      issueNumber: newsletter.issueNumber || "",
      publishDate: newsletter.publishDate
        ? new Date(newsletter.publishDate).toISOString().split("T")[0]
        : "",
      pdfUrl: newsletter.pdfUrl || "",
      published: newsletter.published,
    });
    setEditingId(newsletter.id);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);
    form.reset({
      titleEn: "", titleAr: "", contentEn: "", contentAr: "",
      issueNumber: "", publishDate: "", pdfUrl: "", published: false,
    });
  }

  const count = newsletters?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003B71]">Editions Management</h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage newsletter editions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Newspaper className="w-4 h-4" />
            {count} edition{count !== 1 ? "s" : ""} published
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => !open ? handleClose() : setIsOpen(true)}>
            <DialogTrigger asChild>
              <Button className="bg-[#003B71] text-white hover:bg-[#002a54]">
                <Plus className="w-4 h-4 mr-2" />
                Add Edition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Edition" : "Add Edition"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="titleEn" render={({ field }) => (
                      <FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="titleAr" render={({ field }) => (
                      <FormItem><FormLabel>Title (AR)</FormLabel><FormControl><Input {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="contentEn" render={({ field }) => (
                      <FormItem><FormLabel>Content / Foreword (EN)</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="contentAr" render={({ field }) => (
                      <FormItem><FormLabel>Content / Foreword (AR)</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="issueNumber" render={({ field }) => (
                      <FormItem><FormLabel>Edition Number (Optional)</FormLabel><FormControl><Input placeholder="e.g. 1st Edition" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="publishDate" render={({ field }) => (
                      <FormItem><FormLabel>Publish Date (Optional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="pdfUrl" render={({ field }) => (
                    <FormItem><FormLabel>Preview URL / PDF Link (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="published" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={createNewsletter.isPending || updateNewsletter.isPending}>
                    {editingId ? "Save Changes" : "Create Edition"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Editions Grid */}
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {newsletters?.map((n) => (
            <div key={n.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Edition Header */}
              <div className="bg-[#003B71] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C8102E] flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{n.titleEn}</h3>
                    <p className="text-white/50 text-xs">{n.titleAr}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  n.published ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"
                }`}>
                  {n.published ? "Published" : "Draft"}
                </span>
              </div>

              {/* Edition Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-semibold text-[#003B71]">
                      {n.publishDate
                        ? new Date(n.publishDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                        : "—"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Issue</p>
                    <p className="text-sm font-semibold text-[#003B71]">{n.issueNumber || "—"}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">PDF</p>
                    <p className="text-sm font-semibold text-[#003B71]">{n.pdfUrl ? "Yes" : "No"}</p>
                  </div>
                </div>

                {/* Content Preview */}
                {n.contentEn && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{n.contentEn}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  {n.pdfUrl && (
                    <a
                      href={n.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003B71] text-white text-xs font-medium hover:bg-[#002a54] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(n)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this edition?")) deleteNewsletter.mutate({ id: n.id }); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New placeholder card */}
          <div
            className="bg-white rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center min-h-[300px] cursor-pointer hover:border-[#003B71]/30 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-1">Add New Edition</h3>
              <p className="text-sm text-gray-400">Click to create a new newsletter edition</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
