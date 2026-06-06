import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RatingAndComments from "@/components/RatingComments";
import { useParams, Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export default function VideoDetail() {
  const { t, isRTL, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { data: video, isLoading } = trpc.videos.getById.useQuery({ id: Number(id) });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6 py-16 animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-lg mb-6" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-500">{t("Video not found", "الفيديو غير موجود")}</p>
          <Link href="/videos">
            <span className="text-[#C8102E] hover:underline cursor-pointer mt-4 inline-block">
              {t("Back to Videos", "العودة إلى الفيديوهات")}
            </span>
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const title = lang === "ar" ? video.titleAr : video.titleEn;
  const description = lang === "ar" ? video.descriptionAr : video.descriptionEn;

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />

      <main className="flex-1 bg-[#F5F5F5] py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back link */}
          <Link href="/videos">
            <span className="inline-flex items-center gap-2 text-[#003B71] hover:text-[#C8102E] text-sm mb-6 cursor-pointer">
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t("Back to Videos", "العودة إلى الفيديوهات")}
            </span>
          </Link>

          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-6">
            <video
              controls
              className="w-full aspect-video"
              poster={video.thumbnailUrl || undefined}
            >
              <source 
                src={
                  video.videoUrl.includes("quantum-city") 
                    ? "/assets/videos/Quantum-City-V2 Ffc07ff5.mp4" 
                    : video.videoUrl.includes("rta-video-2")
                    ? "/assets/videos/Rta-Video-2-Smart-City-Indicators D6200346.mp4"
                    : video.videoUrl
                } 
                type="video/mp4" 
              />
              {t("Your browser does not support the video tag.", "متصفحك لا يدعم تشغيل الفيديو.")}
            </video>
          </div>

          {/* Video Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#003B71] mb-3">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              {video.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {video.duration}
                </span>
              )}
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            {description && (
              <p className="text-gray-600 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Rating & Comments */}
          <RatingAndComments contentType="video" contentId={String(video.id)} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
