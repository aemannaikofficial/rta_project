import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RatingAndComments from "@/components/RatingComments";
import PrintButton from "@/components/PrintButton";
import { useParams, Link } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Streamdown } from "streamdown";

export default function ArticleDetail() {
  const { t, isRTL, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading } = trpc.articles.getById.useQuery({ id: Number(id) });

  // Set document.title to correct PDF filename format on page load
  useEffect(() => {
    if (!article) return;
    const langLabel = lang === "ar" ? "AR" : "EN";
    document.title = `Article - ${langLabel}`;
    return () => { document.title = "RTA AI Newsletter"; };
  }, [article, lang]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
        <SiteHeader />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-500">{t("Article not found", "المقال غير موجود")}</p>
          <Link href="/articles">
            <span className="text-[#C8102E] hover:underline cursor-pointer mt-4 inline-block">
              {t("Back to Articles", "العودة إلى المقالات")}
            </span>
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const title = lang === "ar" ? article.titleAr : article.titleEn;
  const content = lang === "ar" ? article.contentAr : article.contentEn;

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />

      <main className="flex-1 bg-[#F5F5F5] py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/articles">
              <span className="inline-flex items-center gap-2 text-[#003B71] hover:text-[#C8102E] text-sm cursor-pointer print-hidden">
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t("Back to Articles", "العودة إلى المقالات")}
              </span>
            </Link>
            <PrintButton contentType="article" contentTitle={title} version={String(article.id)} />
          </div>

          {article.coverImageUrl && (
            <div className="rounded-lg overflow-hidden mb-6 shadow-lg">
              <img src={article.coverImageUrl} alt={title} className="w-full h-64 sm:h-80 object-cover" />
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#003B71] mb-4">{title}</h1>
            <div className="text-sm text-gray-400 mb-6">
              {new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed article-content">
              <Streamdown>{content}</Streamdown>
            </div>
          </div>

          <div className="print-hidden" data-print-hide>
            <RatingAndComments contentType="article" contentId={String(article.id)} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
