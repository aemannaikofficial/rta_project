import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";
import { Play, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function VideosPage() {
  const { t, isRTL, lang } = useLanguage();
  const { data: videosList, isLoading } = trpc.videos.list.useQuery();

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />

      {/* Hero */}
      <section className="bg-[#003B71] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-6 h-6 text-[#C8102E]" />
            <span className="text-[#C8102E] font-semibold text-sm tracking-widest uppercase">
              {t("VIDEO LIBRARY", "مكتبة الفيديو")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-bold mb-2">
            {t("Educational Videos", "فيديوهات تعليمية")}
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            {t("Watch videos about AI innovations in transportation", "شاهد فيديوهات عن ابتكارات الذكاء الاصطناعي في النقل")}
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="flex-1 bg-[#F5F5F5] py-12">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : videosList && videosList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosList.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={`/videos/${video.id}`}>
                    <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="relative aspect-video bg-gray-100">
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt={lang === "ar" ? video.titleAr : video.titleEn} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#003B71]">
                            <Play className="w-12 h-12 text-white/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#C8102E] flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-[#003B71] text-sm leading-tight group-hover:text-[#C8102E] transition-colors line-clamp-2">
                          {lang === "ar" ? video.titleAr : video.titleEn}
                        </h3>
                        {(lang === "ar" ? video.descriptionAr : video.descriptionEn) && (
                          <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                            {lang === "ar" ? video.descriptionAr : video.descriptionEn}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t("Videos coming soon", "الفيديوهات قريبًا")}</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
