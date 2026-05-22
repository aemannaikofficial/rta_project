/*
 * Language Toggle — EN/AR switch
 * RTA website style: works on white top bar
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="flex items-center gap-2 border border-[#003B71]/20 hover:border-[#C8102E] rounded px-3 py-1.5 transition-all duration-200 group bg-white"
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4 text-[#003B71]/60 group-hover:text-[#C8102E] transition-colors" />
      <span className={`text-xs font-bold transition-colors ${lang === "en" ? "text-[#C8102E]" : "text-[#003B71]/40"}`}>
        EN
      </span>
      <div className="w-px h-4 bg-gray-200" />
      <span className={`text-xs font-bold transition-colors ${lang === "ar" ? "text-[#C8102E]" : "text-[#003B71]/40"}`}>
        عربي
      </span>
    </button>
  );
}
