import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RatingAndComments from "@/components/RatingComments";
import PrintButton from "@/components/PrintButton";
import { useParams, Link } from "wouter";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

export default function PosterDetail() {
  const { t, isRTL, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { data: poster, isLoading } = trpc.posters.getById.useQuery({ id: Number(id) });

  // Set document.title to correct PDF filename format on page load
  useEffect(() => {
    if (!poster) return;
    const langLabel = lang === "ar" ? "AR" : "EN";
    document.title = `Poster - ${langLabel}`;
    return () => { document.title = "RTA AI Newsletter"; };
  }, [poster, lang]);

  if (isLoading) return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-6 py-16 animate-pulse">
        <div className="aspect-[3/4] max-w-md mx-auto bg-gray-200 rounded-lg mb-6" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );

  if (!poster) return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">{t("Poster not found", "الملصق غير موجود")}</p>
        <Link href="/posters">
          <span className="text-[#C8102E] hover:underline cursor-pointer mt-4 inline-block">
            {t("Back to Posters", "العودة إلى الملصقات")}
          </span>
        </Link>
      </div>
      <SiteFooter />
    </div>
  );

  const title = lang === "ar" ? poster.titleAr : poster.titleEn;
  const description = lang === "ar" ? poster.descriptionAr : poster.descriptionEn;
  const fullImg = lang === "ar" ? (poster.imageUrlAr || poster.imageUrl) : poster.imageUrl;

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <SiteHeader />
      <main className="flex-1 bg-[#F5F5F5] py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/posters">
              <span className="inline-flex items-center gap-2 text-[#003B71] hover:text-[#C8102E] text-sm cursor-pointer print-hidden">
                {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t("Back to Posters", "العودة إلى الملصقات")}
              </span>
            </Link>
            <PrintButton contentType="poster" contentTitle={title} version={String(poster.id)} />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg">
            <img src={fullImg} alt={title} className="w-full poster-print-img" />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
            <h1 className="text-2xl font-bold text-[#003B71] mb-2">{title}</h1>
            {description && <p className="text-gray-600 leading-relaxed">{description}</p>}
            <a
              href={fullImg}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-[#C8102E] text-sm font-medium hover:underline print-hidden"
            >
              <Download className="w-4 h-4" />
              {t("View Full Size", "عرض بالحجم الكامل")}
            </a>
          </div>

          <div className="print-hidden" data-print-hide>
            <RatingAndComments contentType="poster" contentId={String(poster.id)} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
