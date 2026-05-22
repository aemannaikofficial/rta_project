import { editions, LOGO_URL } from "@/data/newsletter";
import { Newspaper, Eye, ExternalLink, Calendar, FileText } from "lucide-react";
import { Link } from "wouter";

export default function AdminEditions() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003B71]">Editions Management</h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage newsletter editions</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Newspaper className="w-4 h-4" />
          {editions.length} edition{editions.length !== 1 ? "s" : ""} published
        </div>
      </div>

      {/* Editions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {editions.map((ed) => (
          <div key={ed.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Edition Header */}
            <div className="bg-[#003B71] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C8102E] flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{ed.title.en}</h3>
                  <p className="text-white/50 text-xs">{ed.subtitle.en}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                Published
              </span>
            </div>

            {/* Edition Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm font-semibold text-[#003B71]">{ed.month.en} {ed.year}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">Sections</p>
                  <p className="text-sm font-semibold text-[#003B71]">{ed.sections.length}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">References</p>
                  <p className="text-sm font-semibold text-[#003B71]">{ed.references.length}</p>
                </div>
              </div>

              {/* Sections List */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sections</p>
                <div className="space-y-1.5">
                  {ed.sections.map((s) => (
                    <div key={s.num} className="flex items-center gap-2 text-sm">
                      <span className="w-6 h-6 rounded bg-[#003B71]/10 flex items-center justify-center text-[10px] font-bold text-[#003B71] flex-shrink-0">
                        {String(s.num).padStart(2, "0")}
                      </span>
                      <span className="text-gray-600 truncate">{s.title.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <Link href={`/edition/${ed.id}`}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003B71] text-white text-xs font-medium hover:bg-[#002a54] transition-colors cursor-pointer">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </span>
                </Link>
                <a
                  href={`/edition/${ed.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center min-h-[300px]">
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-1">Next Edition</h3>
            <p className="text-sm text-gray-400">May 2026 edition coming soon</p>
            <p className="text-xs text-gray-300 mt-3">Content management via database will be available in a future update</p>
          </div>
        </div>
      </div>
    </div>
  );
}
