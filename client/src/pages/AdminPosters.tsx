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

const posterSchema = z.object({
  titleEn: z.string().min(1, "Title (EN) is required"),
  titleAr: z.string().min(1, "Title (AR) is required"),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  thumbnailUrl: z.string().optional(),
  imageUrlAr: z.string().optional(),
  thumbnailUrlAr: z.string().optional(),
  published: z.boolean().default(false),
});

type PosterFormValues = z.infer<typeof posterSchema>;

export default function AdminPosters() {
  const utils = trpc.useUtils();
  const { data: posters, isLoading } = trpc.posters.adminList.useQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<PosterFormValues>({
    resolver: zodResolver(posterSchema) as any,
    defaultValues: {
      titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "",
      imageUrl: "", thumbnailUrl: "", imageUrlAr: "", thumbnailUrlAr: "",
      published: false,
    },
  });

  const createPoster = trpc.posters.create.useMutation({
    onSuccess: () => {
      utils.posters.invalidate();
      toast.success("Poster created");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updatePoster = trpc.posters.update.useMutation({
    onSuccess: () => {
      utils.posters.invalidate();
      toast.success("Poster updated");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deletePoster = trpc.posters.delete.useMutation({
    onSuccess: () => { utils.posters.invalidate(); toast.success("Poster deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  function onSubmit(data: PosterFormValues) {
    if (editingId) {
      updatePoster.mutate({ id: editingId, ...data });
    } else {
      createPoster.mutate(data);
    }
  }

  function handleEdit(poster: any) {
    form.reset({
      titleEn: poster.titleEn,
      titleAr: poster.titleAr,
      descriptionEn: poster.descriptionEn || "",
      descriptionAr: poster.descriptionAr || "",
      imageUrl: poster.imageUrl,
      thumbnailUrl: poster.thumbnailUrl || "",
      imageUrlAr: poster.imageUrlAr || "",
      thumbnailUrlAr: poster.thumbnailUrlAr || "",
      published: poster.published,
    });
    setEditingId(poster.id);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);
    form.reset({
      titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "",
      imageUrl: "", thumbnailUrl: "", imageUrlAr: "", thumbnailUrlAr: "",
      published: false,
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003B71]">Manage Posters (CRUD)</h1>
        <Dialog open={isOpen} onOpenChange={(open) => !open ? handleClose() : setIsOpen(true)}>
          <DialogTrigger asChild>
            <Button className="bg-[#003B71] text-white hover:bg-[#002a54]">
              <Plus className="w-4 h-4 mr-2" />
              Add Poster
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Poster" : "Add Poster"}</DialogTitle>
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
                  <FormField control={form.control} name="descriptionEn" render={({ field }) => (
                    <FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="descriptionAr" render={({ field }) => (
                    <FormItem><FormLabel>Description (AR)</FormLabel><FormControl><Textarea {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                  <FormItem><FormLabel>Thumbnail URL (EN) (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrlAr" render={({ field }) => (
                  <FormItem><FormLabel>Image URL (AR) (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="thumbnailUrlAr" render={({ field }) => (
                  <FormItem><FormLabel>Thumbnail URL (AR) (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                <Button type="submit" className="w-full" disabled={createPoster.isPending}>
                  {editingId ? "Save Changes" : "Create Poster"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {posters?.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="flex items-center gap-4">
                {(p.thumbnailUrl || p.imageUrl) && <img src={p.thumbnailUrl || p.imageUrl} alt="" className="w-16 h-20 object-cover rounded" />}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{p.titleEn}</p>
                    {!p.published && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-medium">Draft</span>}
                  </div>
                  <p className="text-xs text-gray-500">{p.titleAr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete this poster?")) deletePoster.mutate({ id: p.id }); }} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {(!posters || posters.length === 0) && <p className="text-gray-500">No posters yet.</p>}
        </div>
      )}
    </div>
  );
}
