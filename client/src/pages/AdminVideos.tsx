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

const videoSchema = z.object({
  titleEn: z.string().min(1, "Title (EN) is required"),
  titleAr: z.string().min(1, "Title (AR) is required"),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  videoUrl: z.string().superRefine((val, ctx) => {
    if (!val.startsWith('/') && !z.string().url().safeParse(val).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid URL" });
    }
  }),
  thumbnailUrl: z.string().optional(),
  duration: z.string().optional(),
  published: z.boolean().default(false),
});

type VideoFormValues = z.infer<typeof videoSchema>;

export default function AdminVideos() {
  const utils = trpc.useUtils();
  const { data: videos, isLoading } = trpc.videos.adminList.useQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema) as any,
    defaultValues: {
      titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "",
      videoUrl: "", thumbnailUrl: "", duration: "", published: false,
    },
  });

  const createVideo = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.videos.invalidate();
      toast.success("Video created");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateVideo = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.videos.invalidate();
      toast.success("Video updated");
      handleClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteVideo = trpc.videos.delete.useMutation({
    onSuccess: () => { utils.videos.invalidate(); toast.success("Video deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  function onSubmit(data: VideoFormValues) {
    if (editingId) {
      updateVideo.mutate({ id: editingId, ...data });
    } else {
      createVideo.mutate(data);
    }
  }

  function handleEdit(video: any) {
    form.reset({
      titleEn: video.titleEn,
      titleAr: video.titleAr,
      descriptionEn: video.descriptionEn || "",
      descriptionAr: video.descriptionAr || "",
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      duration: video.duration || "",
      published: video.published,
    });
    setEditingId(video.id);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    setEditingId(null);
    form.reset({
      titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "",
      videoUrl: "", thumbnailUrl: "", duration: "", published: false,
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#003B71]">Manage Videos</h1>
        <Dialog open={isOpen} onOpenChange={(open) => !open ? handleClose() : setIsOpen(true)}>
          <DialogTrigger asChild>
            <Button className="bg-[#003B71] text-white hover:bg-[#002a54]">
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Video" : "Add Video"}</DialogTitle>
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
                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                  <FormItem><FormLabel>Video URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                  <FormItem><FormLabel>Thumbnail URL (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="duration" render={({ field }) => (
                  <FormItem><FormLabel>Duration (Optional)</FormLabel><FormControl><Input placeholder="e.g. 5:30" {...field} /></FormControl><FormMessage /></FormItem>
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
                <Button type="submit" className="w-full" disabled={createVideo.isPending || updateVideo.isPending}>
                  {editingId ? "Save Changes" : "Create Video"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {videos?.map(v => (
            <div key={v.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="flex items-center gap-4">
                {v.thumbnailUrl && <img src={v.thumbnailUrl} alt="" className="w-20 h-12 object-cover rounded" />}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{v.titleEn}</p>
                    {!v.published && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full font-medium">Draft</span>}
                  </div>
                  <p className="text-xs text-gray-500">{v.titleAr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(v)} className="text-blue-500 hover:text-blue-700 p-2"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm("Delete this video?")) deleteVideo.mutate({ id: v.id }); }} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {(!videos || videos.length === 0) && <p className="text-gray-500">No videos yet.</p>}
        </div>
      )}
    </div>
  );
}
