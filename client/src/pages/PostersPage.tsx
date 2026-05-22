import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";
import { Image } from "lucide-react";
import { motion } from "framer-motion";

export default function PostersPage() {
  const { t, isRTL, lang } = useLanguage();
  const { data: postersList, isLoading } = trpc.posters.list.useQuery();

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />
      <section className="bg-[#003B71] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <Image className="w-6 h-6 text-[#C8102E]" />
            <span className="text-[#C8102E] font-semibold text-sm tracking-widest uppercase">{t("POSTER GALLERY", "معرض الملصقات")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-bold mb-2">{t("Infographic Posters", "ملصقات إنفوجرافيك")}</h1>
          <p className="text-white/60 text-base max-w-xl">{t("Visual summaries of AI in transportation", "ملخصات بصرية عن الذكاء الاصطناعي في النقل")}</p>
        </div>
      </section>
      <section className="flex-1 bg-[#F5F5F5] py-12">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (<div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"><div className="aspect-[3/4] bg-gray-200" /><div className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4" /></div></div>))}
            </div>
          ) : postersList && postersList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postersList.map((poster, i) => {
                const imgUrl = lang === "ar" ? (poster.thumbnailUrlAr || poster.imageUrlAr || poster.thumbnailUrl || poster.imageUrl) : (poster.thumbnailUrl || poster.imageUrl);
                return (
                  <motion.div key={poster.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                    <Link href={`/posters/${poster.id}`}>
                      <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                        <div className="aspect-[3/4] bg-gray-100"><img src={imgUrl} alt={lang === "ar" ? poster.titleAr : poster.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                        <div className="p-4"><h3 className="font-semibold text-[#003B71] text-sm group-hover:text-[#C8102E] transition-colors line-clamp-2">{lang === "ar" ? poster.titleAr : poster.titleEn}</h3></div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16"><Image className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">{t("Posters coming soon", "الملصقات قريبًا")}</p></div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
