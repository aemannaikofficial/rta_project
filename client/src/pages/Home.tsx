/*
 * RTA AI Newsletter — Edition Reader Page
 * Design: Matches official rta.ae website style
 * 3-tier header: white top bar, red nav bar, hero
 * Colors: Navy #003B71, Red #C8102E, White, Light Gray #F5F5F5
 */
import { useEffect, useState, useRef } from "react";
import { getEdition, UI, LOGO_URL, type Edition, type Section, type BiText } from "@/data/newsletter";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { motion, useInView } from "framer-motion";
import { Link, useParams } from "wouter";
import { ChevronLeft, ChevronRight, ArrowUp, Search, Globe, Newspaper, Menu, X } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import RatingAndComments from "@/components/RatingComments";
import PrintButton from "@/components/PrintButton";

function useBi(bi: BiText): string {
  const { lang } = useLanguage();
  return lang === "ar" ? bi.ar : bi.en;
}

/* ─── Reading Progress ─── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-[60]">
      <div className="h-full transition-all duration-150 ease-out bg-[#C8102E]" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* ─── 3-Tier Header ─── */
function SiteHeader({ edition, activeSection }: { edition: Edition; activeSection: number }) {
  const { isRTL, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed compact header on scroll */}
      <header className={`fixed top-0.5 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="bg-[#C8102E] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <Link href="/">
                <img src={LOGO_URL} alt="RTA" className="h-8 w-auto cursor-pointer brightness-0 invert" />
              </Link>
              <div className="hidden sm:block w-px h-6 bg-white/20" />
              <span className="hidden sm:block text-white text-sm font-semibold">
                {useBi(UI.aiNewsletter)} — {useBi(edition.subtitle)}
              </span>
            </div>
            <nav className="hidden lg:flex items-center gap-0.5">
              {edition.sections.map((s) => (
                <a
                  key={s.num}
                  href={`#section-${s.num}`}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all duration-200 ${
                    activeSection === s.num
                      ? "bg-white text-[#C8102E]"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {s.num}. {useBi(s.shortTitle)}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden text-white p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#003B71] border-t border-white/10 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1">
              {edition.sections.map((s) => (
                <a
                  key={s.num}
                  href={`#section-${s.num}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-xs rounded transition-colors ${
                    activeSection === s.num
                      ? "bg-[#C8102E] text-white font-semibold"
                      : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  {s.num}. {useBi(s.shortTitle)}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Static top header (visible before scroll) */}
      <div className={`transition-opacity duration-300 ${scrolled ? "opacity-0" : "opacity-100"}`}>
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
        <nav className="bg-[#C8102E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <Link href="/">
                <span className="text-white/80 text-sm px-3 py-1.5 hover:bg-white/10 rounded transition-colors cursor-pointer whitespace-nowrap">
                  {useBi(UI.backToEditions)}
                </span>
              </Link>
              <span className="text-white/30">|</span>
              {edition.sections.slice(0, 6).map((s) => (
                <a
                  key={s.num}
                  href={`#section-${s.num}`}
                  className="hidden md:block text-white/70 text-xs px-2 py-1.5 hover:bg-white/10 rounded transition-colors whitespace-nowrap"
                >
                  {useBi(s.shortTitle)}
                </a>
              ))}
            </div>
            <button className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

/* ─── Hero ─── */
function HeroSection({ edition }: { edition: Edition }) {
  const { isRTL, t } = useLanguage();
  return (
    <section className="relative bg-[#003B71] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M0 0l80 80M80 0L0 80'/%3E%3C/g%3E%3C/svg%3E")`
      }} />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className={`flex flex-col lg:flex-row items-center gap-10 ${isRTL ? "lg:flex-row-reverse" : ""}`}>
          <motion.div className="flex-1" initial={{ opacity: 0, x: isRTL ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#C8102E] rounded-full" />
              <span className="text-[#C8102E] font-semibold text-sm tracking-wider uppercase">
                {useBi(edition.subtitle)} — {useBi(edition.month)} {edition.year}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6 font-bold">
              {useBi(edition.title)}
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-lg mb-8">
              {useBi(edition.foreword).slice(0, 200).replace(/[\s—]+$/, '')}...
            </p>
            <a
              href="#section-1"
              className="inline-flex items-center gap-2 bg-[#C8102E] text-white font-semibold px-6 py-3 rounded hover:bg-[#a00d24] transition-colors text-sm"
            >
              {useBi(UI.readNow)}
              <svg className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
          <motion.div className="flex-shrink-0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <img src={LOGO_URL} alt="RTA Logo" className="h-40 sm:h-52 w-auto opacity-20" style={{ display: "none" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Table of Contents ─── */
function TOCSection({ edition }: { edition: Edition }) {
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="bg-[#F5F5F5] py-12">
      <motion.div ref={ref} className="max-w-6xl mx-auto px-6" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-[#C8102E] rounded-full" />
          <h2 className="text-xl font-bold text-[#003B71]">{useBi(UI.contents)}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {edition.sections.map((s, i) => (
            <motion.a
              key={s.num}
              href={`#section-${s.num}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100 hover:border-[#C8102E]/30 hover:shadow-md transition-all duration-200"
            >
              <div className="w-8 h-8 rounded bg-[#003B71] flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8102E] transition-colors">
                <span className="text-white text-xs font-bold">{String(s.num).padStart(2, "0")}</span>
              </div>
              <span className="text-[#003B71] text-xs font-medium leading-tight group-hover:text-[#C8102E] transition-colors">
                {useBi(s.shortTitle)}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Foreword ─── */
function ForewordSection({ edition }: { edition: Edition }) {
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="foreword" className="py-16 bg-white">
      <motion.div ref={ref} className="max-w-4xl mx-auto px-6" initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#C8102E] rounded-full" />
          <span className="text-[#003B71] font-bold text-lg">{useBi(UI.foreword)}</span>
        </div>
        <div className="border-[#C8102E]/30" style={{ borderInlineStartWidth: '4px', paddingInlineStart: '1.5rem' }}>
          <p className={`text-gray-600 text-base leading-relaxed ${isRTL ? "leading-loose" : ""}`}>
            {useBi(edition.foreword)}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Section Block ─── */
function SectionBlock({ section, index }: { section: Section; index: number }) {
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;

  return (
    <section id={`section-${section.num}`} className={`py-14 sm:py-16 scroll-mt-16 ${isEven ? "bg-white" : "bg-[#F5F5F5]"}`}>
      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded bg-[#C8102E] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">{String(section.num).padStart(2, "0")}</span>
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl sm:text-3xl text-[#003B71] leading-tight font-bold`}>
              {useBi(section.title)}
            </h2>
            <div className="w-16 h-0.5 bg-[#C8102E] mt-3" />
          </div>
        </div>

        {/* Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start`}>
          <div className={`lg:col-span-7 ${isEven ? "" : "lg:order-2"}`}>
            {section.body.map((p, i) => (
              <p key={i} className={`text-gray-600 leading-relaxed mb-4 ${isRTL ? "leading-loose" : ""}`}>
                {useBi(p)}
              </p>
            ))}

            {section.bullets && (
              <div className="space-y-3 my-6">
                {section.bullets.map((b, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E] mt-2.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-[#003B71]">{useBi(b.label)}:</span>{" "}
                      <span className="text-gray-600">{useBi(b.text)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.table && (
              <div className="my-6 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {section.table.headers.map((h, i) => (
                        <th key={i} className={`bg-[#003B71] text-white px-5 py-3 font-semibold ${isRTL ? "text-right" : "text-left"}`}>
                          {useBi(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-5 py-3 text-gray-600 border-b border-gray-100">
                            {useBi(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.callout && (
              <div className="mt-6 border-[#C8102E] bg-[#C8102E]/5 rounded px-5 py-4" style={{ borderInlineStartWidth: '4px' }}>
                <span className="text-[#C8102E] font-bold text-xs uppercase tracking-wider">
                  {section.callout.type === "insight" ? useBi(UI.insight) : section.callout.type === "result" ? useBi(UI.result) : useBi(UI.conclusion)}
                </span>
                <p className={`text-[#003B71]/80 mt-2 text-sm leading-relaxed ${isRTL ? "leading-loose" : ""}`}>
                  {useBi(section.callout.text)}
                </p>
              </div>
            )}
          </div>

          {/* Image Column */}
          <div className={`lg:col-span-5 ${isEven ? "" : "lg:order-1"}`}>
            <div className="sticky top-20">
              <div className="relative overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#C8102E]" />
                <img src={section.image} alt={useBi(section.title)} className="w-full object-cover aspect-[4/3]" />
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                {useBi(UI.section)} {section.num} — {useBi(section.shortTitle)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Final Note ─── */
function FinalNote({ edition }: { edition: Edition }) {
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section className="py-16 bg-[#003B71]">
      <motion.div ref={ref} className="max-w-4xl mx-auto px-6" initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
        <div className={`flex items-center gap-3 mb-6 justify-center`}>
          <div className="w-8 h-0.5 bg-[#C8102E]" />
          <span className="text-[#C8102E] font-bold text-sm tracking-wider uppercase">{useBi(UI.finalNote)}</span>
          <div className="w-8 h-0.5 bg-[#C8102E]" />
        </div>
        <p className={`text-white/80 text-base leading-relaxed text-center ${isRTL ? "leading-loose" : ""}`}>
          {useBi(edition.finalNote)}
        </p>
      </motion.div>
    </section>
  );
}

/* ─── References ─── */
function ReferencesSection({ edition }: { edition: Edition }) {
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section className="py-14 bg-[#F5F5F5]">
      <motion.div ref={ref} className="max-w-4xl mx-auto px-6" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-[#C8102E] rounded-full" />
          <h3 className="text-xl font-bold text-[#003B71]">{useBi(UI.references)}</h3>
        </div>
        <div className="space-y-3">
          {edition.references.map((r) => (
            <div key={r.id} className="flex gap-3 text-sm bg-white rounded-lg p-4 border border-gray-100">
              <span className="text-[#C8102E] font-bold flex-shrink-0">[{r.id}]</span>
              <div>
                <span className="text-gray-500">{r.text}</span>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="block text-[#003B71] hover:text-[#C8102E] transition-colors text-xs mt-1 break-all" dir="ltr">
                    {r.url}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}



/* ─── Back to Top ─── */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded bg-[#C8102E] text-white shadow-lg hover:bg-[#a00d24] transition-all duration-300 flex items-center justify-center"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const params = useParams<{ id: string }>();
  const editionId = params.id;
  const edition = getEdition(editionId || "");
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState(1);

  // Set document.title to correct PDF filename format on page load
  useEffect(() => {
    if (!edition) return;
    const langLabel = isRTL ? "AR" : "EN";
    document.title = `Newsletter - ${langLabel}`;
    return () => { document.title = "RTA AI Newsletter"; };
  }, [edition, isRTL]);

  useEffect(() => {
    if (!edition) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id?.startsWith("section-")) {
              setActiveSection(parseInt(id.replace("section-", "")));
            }
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    edition.sections.forEach((s) => {
      const el = document.getElementById(`section-${s.num}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [edition]);

  if (!edition) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl text-[#003B71] mb-4 font-bold">Edition Not Found</h1>
          <Link href="/">
            <span className="text-[#C8102E] hover:underline cursor-pointer">Back to Editions</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      <ReadingProgress />
      <SiteHeader edition={edition} activeSection={activeSection} />
      <HeroSection edition={edition} />
      <TOCSection edition={edition} />
      {/* Print Button */}
      <div className="print-hidden max-w-6xl mx-auto px-6 py-4 flex justify-end">
        <PrintButton contentType="newsletter" contentTitle={isRTL ? edition.title.ar : edition.title.en} version={`Edition${edition.number}-${isRTL ? edition.month.ar : edition.month.en}${edition.year}`} />
      </div>
      <ForewordSection edition={edition} />
      <main>
        {edition.sections.map((s, i) => (
          <SectionBlock key={s.num} section={s} index={i} />
        ))}
      </main>
      <FinalNote edition={edition} />
      <ReferencesSection edition={edition} />
      {/* Rating & Comments */}
      <section className="py-12 bg-[#F5F5F5] print-hidden" data-print-hide>
        <div className="max-w-4xl mx-auto px-6">
          <RatingAndComments contentType="newsletter" contentId={editionId || ""} />
        </div>
      </section>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}
