/*
 * RTA AI Content Hub — Homepage
 * Matches the approved live rta-ai.com design exactly
 * Hero: "AI CONTENT HUB / AI in Transport" with 2 CTAs
 * Feature bar: Newsletters, Videos, Articles, Posters (colored blocks)
 * Content sections: Newsletter Editions, Educational Videos, Latest Articles, Posters & Infographics
 * Footer: RTA branded with mission, quick links, contact
 */
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LOGO_URL, UI } from "@/data/newsletter";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import { trpc } from "@/lib/trpc";
import { Globe, Newspaper, Play, FileText, Image, ChevronRight } from "lucide-react";

export default function Editions() {
  const { lang, t, isRTL } = useLanguage();

  // Fetch content from database
  const { data: newslettersList } = trpc.newsletters.list.useQuery();
  const { data: videosList } = trpc.videos.list.useQuery();
  const { data: articlesList } = trpc.articles.list.useQuery();
  const { data: postersList } = trpc.posters.list.useQuery();

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />

      {/* ── Hero Banner Section ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/images/rta-banner-ai-transport-notext-X9BjEHDTAtZWzUB64XipN9.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 via-[#003B71]/70 to-[#003B71]/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 sm:py-28">
          <div className={`flex flex-col ${isRTL ? "items-end text-right" : "items-start text-left"} gap-6`}>
            <motion.div initial={{ opacity: 0, x: isRTL ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-[#C8102E]" />
                <span className="text-[#fffafb] font-semibold text-sm tracking-widest uppercase">
                  {t("AI Content Hub", "مركز محتوى الذكاء الاصطناعي")}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4 font-bold">
                {t("AI in Transport", "الذكاء الاصطناعي في النقل")}
              </h1>
              <p className="text-white/80 text-lg max-w-xl leading-relaxed">
                {t(
                  "Explore newsletters, videos, articles, and posters about AI innovations in transportation.",
                  "استكشف النشرات والفيديوهات والمقالات والملصقات حول ابتكارات الذكاء الاصطناعي في النقل."
                )}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Link href="/newsletters">
                <span className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-semibold px-6 py-3 rounded hover:bg-[#a00d24] transition-colors text-sm cursor-pointer">
                  {t("Browse Newsletters", "تصفح النشرات")}
                  <svg className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/videos">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3 rounded hover:bg-white/20 transition-colors text-sm cursor-pointer border border-white/20">
                  {t("Watch Videos", "شاهد الفيديوهات")}
                  <Play className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Content Type Feature Bar (colored blocks) ── */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {[
          { bg: "bg-[#7B2D8E]", icon: Newspaper, label: { en: "Newsletters", ar: "النشرات" }, href: "/newsletters" },
          { bg: "bg-[#00A19A]", icon: Play, label: { en: "Videos", ar: "الفيديوهات" }, href: "/videos" },
          { bg: "bg-[#0072CE]", icon: FileText, label: { en: "Articles", ar: "المقالات" }, href: "/articles" },
          { bg: "bg-[#003B71]", icon: Image, label: { en: "Posters", ar: "الملصقات" }, href: "/posters" },
        ].map((item, i) => (
          <Link key={i} href={item.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className={`${item.bg} p-6 flex flex-col items-center justify-center gap-3 text-white text-center min-h-[120px] cursor-pointer hover:brightness-110 transition-all`}
            >
              <item.icon className="w-8 h-8 opacity-90" />
              <span className="text-sm font-semibold">{t(item.label.en, item.label.ar)}</span>
              <div className="w-8 h-0.5 bg-white/30 rounded" />
            </motion.div>
          </Link>
        ))}
      </section>

      {/* ── Newsletter Editions ── */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-1 h-8 bg-[#C8102E] rounded-full" />
              <h2 className="text-2xl font-bold text-[#003B71]">
                {t("Newsletter Editions", "إصدارات النشرة")}
              </h2>
            </div>
            <Link href="/newsletters">
              <span className={`flex items-center gap-1 text-[#C8102E] text-sm font-semibold hover:underline cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                {t("View All", "عرض الكل")}
                <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newslettersList && newslettersList.length > 0 ? (
              newslettersList.map((n: any, i: number) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                    <div className="bg-[#003B71] p-6 relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#C8102E]" />
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">
                            {n.publishDate
                              ? new Date(n.publishDate).toLocaleDateString(
                                  lang === "ar" ? "ar-AE" : "en-US",
                                  { month: "long", year: "numeric" }
                                )
                              : ""}
                          </span>
                          <h3 className="text-white text-xl font-bold mt-1">
                            {lang === "ar" ? (n.titleAr || n.titleEn) : n.titleEn}
                          </h3>
                        </div>
                        {n.issueNumber && (
                          <span className="bg-[#C8102E] text-white text-xs font-bold px-3 py-1 rounded">
                            {n.issueNumber}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className={`text-gray-500 text-sm leading-relaxed line-clamp-3 ${isRTL ? "text-right" : ""}`}>
                        {(lang === "ar"
                          ? (n.contentAr || n.contentEn || "")
                          : (n.contentEn || "")
                        ).slice(0, 180)}...
                      </p>
                      <div className={`mt-4 flex items-center gap-2 text-[#C8102E] text-sm font-semibold group-hover:gap-3 transition-all ${isRTL ? "flex-row-reverse" : ""}`}>
                        {n.pdfUrl ? (
                          <a
                            href={n.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{t("Read Edition", "اقرأ الإصدار")}</span>
                            <svg className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        ) : (
                          <>
                            <span>{t("Read Edition", "اقرأ الإصدار")}</span>
                            <svg className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-3">{t("No editions yet.", "لا توجد إصدارات بعد.")}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Educational Videos ── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-1 h-8 bg-[#C8102E] rounded-full" />
              <h2 className="text-2xl font-bold text-[#003B71]">
                {t("Educational Videos", "فيديوهات تعليمية")}
              </h2>
            </div>
            <Link href="/videos">
              <span className={`flex items-center gap-1 text-[#C8102E] text-sm font-semibold hover:underline cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                {t("View All", "عرض الكل")}
                <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videosList && videosList.length > 0 ? (
              videosList.slice(0, 3).map((video: any) => (
                <Link key={video.id} href={`/videos/${video.id}`}>
                  <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt={lang === "ar" ? video.titleAr : video.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-[#003B71]/10 flex items-center justify-center">
                          <Play className="w-12 h-12 text-[#003B71]/30" />
                        </div>
                      )}
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#C8102E]/90 flex items-center justify-center group-hover:bg-[#C8102E] transition-colors shadow-lg">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-[#003B71] font-semibold text-sm leading-tight">
                        {lang === "ar" ? (video.titleAr || video.titleEn) : video.titleEn}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-3">{t("No videos yet.", "لا توجد فيديوهات بعد.")}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Latest Articles ── */}
      <section className="bg-[#F5F5F5] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-1 h-8 bg-[#C8102E] rounded-full" />
              <h2 className="text-2xl font-bold text-[#003B71]">
                {t("Latest Articles", "أحدث المقالات")}
              </h2>
            </div>
            <Link href="/articles">
              <span className={`flex items-center gap-1 text-[#C8102E] text-sm font-semibold hover:underline cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                {t("View All", "عرض الكل")}
                <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesList && articlesList.length > 0 ? (
              articlesList.slice(0, 3).map((article: any) => (
                <Link key={article.id} href={`/articles/${article.id}`}>
                  <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                    {article.coverImageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img src={article.coverImageUrl} alt={lang === "ar" ? article.titleAr : article.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-[#003B71] font-bold text-base leading-tight mb-2">
                        {lang === "ar" ? (article.titleAr || article.titleEn) : article.titleEn}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {lang === "ar"
                          ? (article.summaryAr || article.contentAr || "").slice(0, 150)
                          : (article.summaryEn || article.contentEn || "").slice(0, 150)}
                        ...
                      </p>
                      <div className={`mt-3 flex items-center gap-2 text-[#C8102E] text-sm font-semibold group-hover:gap-3 transition-all ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span>{t("Read More", "اقرأ المزيد")}</span>
                        <svg className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-sm col-span-3">{t("No articles yet.", "لا توجد مقالات بعد.")}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Posters & Infographics ── */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-1 h-8 bg-[#C8102E] rounded-full" />
              <h2 className="text-2xl font-bold text-[#003B71]">
                {t("Posters & Infographics", "ملصقات ورسوم بيانية")}
              </h2>
            </div>
            <Link href="/posters">
              <span className={`flex items-center gap-1 text-[#C8102E] text-sm font-semibold hover:underline cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                {t("View All", "عرض الكل")}
                <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {postersList && postersList.length > 0 ? (
              postersList.slice(0, 3).map((poster: any) => {
                const imgUrl = lang === "ar" ? (poster.imageUrlAr || poster.imageUrl) : poster.imageUrl;
                const title = lang === "ar" ? (poster.titleAr || poster.titleEn) : poster.titleEn;
                return (
                  <Link key={poster.id} href={`/posters/${poster.id}`}>
                    <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                        {imgUrl ? (
                          <img src={imgUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#003B71] font-semibold text-sm leading-tight">
                          {title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm col-span-3">{t("No posters yet.", "لا توجد ملصقات بعد.")}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer (matching approved live site) ── */}
      <footer className="bg-[#003B71]">
        <div className="h-1 bg-[#C8102E]" />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-start ${isRTL ? "text-right" : ""}`}>
            {/* Logo & Info */}
            <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"} gap-4`}>
              <img src={LOGO_URL} alt="RTA Logo" className="h-14 w-auto" />
              <p className="text-white/40 text-xs leading-relaxed max-w-xs">
                {t(
                  "Roads and Transport Authority — Government of Dubai. Committed to providing safe, smooth, and sustainable transport solutions.",
                  "هيئة الطرق والمواصلات — حكومة دبي. ملتزمون بتوفير حلول نقل آمنة وسلسة ومستدامة."
                )}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t("Quick Links", "روابط سريعة")}</h4>
              <div className="space-y-2">
                <Link href="/newsletters"><span className="block text-white/50 hover:text-[#C8102E] text-sm transition-colors cursor-pointer">{t("Newsletter", "النشرة")}</span></Link>
                <Link href="/videos"><span className="block text-white/50 hover:text-[#C8102E] text-sm transition-colors cursor-pointer">{t("Videos", "الفيديوهات")}</span></Link>
                <Link href="/articles"><span className="block text-white/50 hover:text-[#C8102E] text-sm transition-colors cursor-pointer">{t("Articles", "المقالات")}</span></Link>
                <Link href="/posters"><span className="block text-white/50 hover:text-[#C8102E] text-sm transition-colors cursor-pointer">{t("Posters", "الملصقات")}</span></Link>
                <a href="https://www.rta.ae" target="_blank" rel="noopener noreferrer" className="block text-white/50 hover:text-[#C8102E] text-sm transition-colors">
                  {t("RTA Official Website", "الموقع الرسمي للهيئة")}
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t("Contact", "تواصل معنا")}</h4>
              <a
                href="https://www.rta.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-semibold px-5 py-2.5 rounded hover:bg-[#a00d24] transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                www.rta.ae
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} {t(UI.copyright.en, UI.copyright.ar)}
            </p>
            <p className="text-white/20 text-xs">
              {t(UI.tagline.en, UI.tagline.ar)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
