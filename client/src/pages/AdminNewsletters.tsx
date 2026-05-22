import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, Plus } from "lucide-react";
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

export default function AdminNewsletters() {
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
      toast.success("Newsletter created");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateNewsletter = trpc.newsletters.update.useMutation({
    onSuccess: () => {
      utils.newsletters.invalidate();
      toast.success("Newsletter updated");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteNewsletter = trpc.newsletters.delete.useMutation({
    onSuccess: () => { utils.newsletters.invalidate(); toast.success("Newsletter deleted"); },
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
      publishDate: newsletter.publishDate ? new Date(newsletter.publishDate).toISOString().split('T')[0] : "",
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003B71]">Manage Newsletters</h1>
        <Dialog open={isOpen} onOpenChange={(open) => !open ? handleClose() : setIsOpen(true)}>
          <DialogTrigger asChild>
            <Button className="bg-[#003B71] text-white hover:bg-[#002a54]">
              <Plus className="w-4 h-4 mr-2" />
              Add Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Newsletter" : "Add Newsletter"}</DialogTitle>
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
                    <FormItem><FormLabel>Content (EN)</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="contentAr" render={({ field }) => (
                    <FormItem><FormLabel>Content (AR)</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="issueNumber" render={({ field }) => (
                    <FormItem><FormLabel>Issue Number (Optional)</FormLabel><FormControl><Input placeholder="e.g. Issue 1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="publishDate" render={({ field }) => (
                    <FormItem><FormLabel>Publish Date (Optional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="pdfUrl" render={({ field }) => (
                  <FormItem><FormLabel>PDF URL (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                  {editingId ? "Save Changes" : "Create Newsletter"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {newsletters?.map(n => (
            <div key={n.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{n.titleEn}</p>
                    {n.issueNumber && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{n.issueNumber}</span>}
                    {!n.published && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-medium">Draft</span>}
                  </div>
                  <p className="text-xs text-gray-500">{n.titleAr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(n)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete this newsletter?")) deleteNewsletter.mutate({ id: n.id }); }} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {(!newsletters || newsletters.length === 0) && <p className="text-gray-500">No newsletters yet.</p>}
        </div>
      )}
    </div>
  );
}
