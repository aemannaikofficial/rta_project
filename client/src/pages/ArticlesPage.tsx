import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link } from "wouter";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ArticlesPage() {
  const { t, isRTL, lang } = useLanguage();
  const { data: articlesList, isLoading } = trpc.articles.list.useQuery();

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />

      <section className="bg-[#003B71] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-[#C8102E]" />
            <span className="text-[#C8102E] font-semibold text-sm tracking-widest uppercase">
              {t("ARTICLES", "المقالات")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-bold mb-2">
            {t("Research & Insights", "أبحاث ورؤى")}
          </h1>
          <p className="text-white/60 text-base max-w-xl">
            {t("In-depth articles on AI in transportation", "مقالات معمّقة عن الذكاء الاصطناعي في النقل")}
          </p>
        </div>
      </section>

      <section className="flex-1 bg-[#F5F5F5] py-12">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1,2].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse flex">
                  <div className="w-48 bg-gray-200" />
                  <div className="p-6 flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : articlesList && articlesList.length > 0 ? (
            <div className="space-y-6">
              {articlesList.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={`/articles/${article.id}`}>
                    <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row">
                      {article.coverImageUrl && (
                        <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                          <img src={article.coverImageUrl} alt={lang === "ar" ? article.titleAr : article.titleEn} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5 flex-1">
                        <h3 className="font-bold text-[#003B71] text-lg group-hover:text-[#C8102E] transition-colors mb-2 line-clamp-2">
                          {lang === "ar" ? article.titleAr : article.titleEn}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-3">
                          {lang === "ar" ? (article.summaryAr || article.contentAr.slice(0, 200)) : (article.summaryEn || article.contentEn.slice(0, 200))}
                        </p>
                        <span className="text-[#C8102E] text-sm font-medium">
                          {t("Read More →", "اقرأ المزيد ←")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t("Articles coming soon", "المقالات قريبًا")}</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
