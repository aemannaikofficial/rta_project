import { useLanguage } from "@/contexts/LanguageContext";
import { LOGO_URL, UI } from "@/data/newsletter";
import { Link } from "wouter";
import { Globe } from "lucide-react";

export default function SiteFooter() {
  const { t, isRTL } = useLanguage();

  return (
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
  );
}
