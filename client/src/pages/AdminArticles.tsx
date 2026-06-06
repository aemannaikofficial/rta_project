import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const articleSchema = z.object({
  titleEn: z.string().min(1, "Title (EN) is required"),
  titleAr: z.string().min(1, "Title (AR) is required"),
  summaryEn: z.string().optional(),
  summaryAr: z.string().optional(),
  contentEn: z.string().min(1, "Content (EN) is required"),
  contentAr: z.string().min(1, "Content (AR) is required"),
  coverImageUrl: z.string().optional(),
  published: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function AdminArticles() {
  const utils = trpc.useUtils();
  const { data: articles, isLoading } = trpc.articles.adminList.useQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema) as any,
    defaultValues: {
      titleEn: "", titleAr: "", summaryEn: "", summaryAr: "",
      contentEn: "", contentAr: "", coverImageUrl: "", published: false,
    },
  });

  const createArticle = trpc.articles.create.useMutation({
    onSuccess: () => {
      utils.articles.invalidate();
      toast.success("Article created");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateArticle = trpc.articles.update.useMutation({
    onSuccess: () => {
      utils.articles.invalidate();
      toast.success("Article updated");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteArticle = trpc.articles.delete.useMutation({
    onSuccess: () => { utils.articles.invalidate(); toast.success("Article deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  function onSubmit(data: ArticleFormValues) {
    if (editingId) {
      updateArticle.mutate({ id: editingId, ...data });
    } else {
      createArticle.mutate(data);
    }
  }

  function handleEdit(article: any) {
    form.reset({
      titleEn: article.titleEn,
      titleAr: article.titleAr,
      summaryEn: article.summaryEn || "",
      summaryAr: article.summaryAr || "",
      contentEn: article.contentEn,
      contentAr: article.contentAr,
      coverImageUrl: article.coverImageUrl || "",
      published: article.published,
    });
    setEditingId(article.id);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);
    form.reset({
      titleEn: "", titleAr: "", summaryEn: "", summaryAr: "",
      contentEn: "", contentAr: "", coverImageUrl: "", published: false,
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003B71]">Manage Articles</h1>
        <Dialog open={isOpen} onOpenChange={(open) => !open ? handleClose() : setIsOpen(true)}>
          <DialogTrigger asChild>
            <Button className="bg-[#003B71] text-white hover:bg-[#002a54]">
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Article" : "Add Article"}</DialogTitle>
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
                  <FormField control={form.control} name="summaryEn" render={({ field }) => (
                    <FormItem><FormLabel>Summary (EN)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="summaryAr" render={({ field }) => (
                    <FormItem><FormLabel>Summary (AR)</FormLabel><FormControl><Textarea {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="contentEn" render={({ field }) => (
                    <FormItem><FormLabel>Content (EN)</FormLabel><FormControl><RichTextEditor className="min-h-[200px]" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="contentAr" render={({ field }) => (
                    <FormItem><FormLabel>Content (AR)</FormLabel><FormControl><RichTextEditor className="min-h-[200px]" {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="coverImageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Cover Image URL (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                <Button type="submit" className="w-full" disabled={createArticle.isPending || updateArticle.isPending}>
                  {editingId ? "Save Changes" : "Create Article"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {articles?.map(a => (
            <div key={a.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="flex items-center gap-4">
                {a.coverImageUrl && <img src={a.coverImageUrl} alt="" className="w-20 h-12 object-cover rounded" />}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{a.titleEn}</p>
                    {!a.published && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-medium">Draft</span>}
                  </div>
                  <p className="text-xs text-gray-500">{a.titleAr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(a)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete this article?")) deleteArticle.mutate({ id: a.id }); }} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {(!articles || articles.length === 0) && <p className="text-gray-500">No articles yet.</p>}
        </div>
      )}
    </div>
  );
}
