import { useLanguage } from "@/contexts/LanguageContext";
import { LOGO_URL } from "@/data/newsletter";
import LanguageToggle from "@/components/LanguageToggle";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", labelEn: "Home", labelAr: "الرئيسية" },
  { href: "/newsletters", labelEn: "Newsletter", labelAr: "النشرة" },
  { href: "/videos", labelEn: "Videos", labelAr: "الفيديوهات" },
  { href: "/articles", labelEn: "Articles", labelAr: "المقالات" },
  { href: "/posters", labelEn: "Posters", labelAr: "الملصقات" },
  { href: "https://www.rta.ae/en/media-center", labelEn: "Media Center", labelAr: "المركز الإعلامي", external: true },
];

export default function SiteHeader() {
  const { t, isRTL } = useLanguage();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header>
      {/* Tier 1: White top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src={LOGO_URL} alt="RTA Logo" className="h-12 w-auto cursor-pointer" />
            </Link>
            <div className={`hidden sm:block ${isRTL ? "border-r border-gray-300 pr-4" : "border-l border-gray-300 pl-4"}`}>
              <img
                src="/assets/images/dubai-gov-logo-updated_07bf5485.png"
                alt={t("Government of Dubai", "حكومة دبي")}
                className="h-10 w-auto"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Tier 2: Red navigation bar */}
      <nav className="bg-[#C8102E] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item, i) => {
              const isActive = !item.external && location === item.href;
              if (item.external) {
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 text-sm px-3 py-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                    {t(item.labelEn, item.labelAr)}
                  </a>
                );
              }
              return (
                <Link key={i} href={item.href}>
                  <span className={`text-sm px-3 py-1.5 rounded transition-colors cursor-pointer ${
                    isActive ? "bg-white/20 text-white font-semibold" : "text-white/80 hover:bg-white/10"
                  }`}>
                    {t(item.labelEn, item.labelAr)}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#a00d24]" />
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#003B71] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => {
              if (item.external) {
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 text-sm px-3 py-2 hover:bg-white/5 rounded"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.labelEn, item.labelAr)}
                  </a>
                );
              }
              return (
                <Link key={i} href={item.href}>
                  <span
                    className={`text-sm px-3 py-2 rounded cursor-pointer block ${
                      location === item.href ? "bg-[#C8102E] text-white font-semibold" : "text-white/70 hover:bg-white/5"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item.labelEn, item.labelAr)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
