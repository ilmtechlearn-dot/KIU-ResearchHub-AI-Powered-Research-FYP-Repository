import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ResearchItem, Department, SimilarProjectResult } from '../types';
import { api } from '../services/api';

interface FypDiscoveryPageProps {
  onViewFyp: (id: string) => void;
  onAskAi: (item: ResearchItem) => void;
  onNavigate: (page: string) => void;
}

export const FypDiscoveryPage: React.FC<FypDiscoveryPageProps> = ({
  onViewFyp,
  onAskAi,
  onNavigate,
}) => {
  const [fyps, setFyps] = useState<ResearchItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedTech, setSelectedTech] = useState('all');
  const [loading, setLoading] = useState(true);

  // Similarity inspection modal
  const [inspectingItem, setInspectingItem] = useState<ResearchItem | null>(null);
  const [similarResults, setSimilarResults] = useState<SimilarProjectResult[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [fypRes, depts] = await Promise.all([
          api.getResearch({ type: 'FYP', limit: 50 }),
          api.getDepartments(),
        ]);
        setFyps(fypRes.items);
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load FYPs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleInspectSimilarity = async (item: ResearchItem) => {
    setInspectingItem(item);
    setSimilarLoading(true);
    try {
      const res = await api.getSimilarResearch(item.id, 4);
      setSimilarResults(res);
    } catch {
      setSimilarResults([]);
    } finally {
      setSimilarLoading(false);
    }
  };

  const filteredFyps = fyps.filter((item) => {
    if (selectedDept !== 'all' && item.departmentId !== selectedDept) return false;
    if (selectedYear !== 'all' && item.year.toString() !== selectedYear) return false;
    if (selectedTech !== 'all' && !item.technologies.some((t) => t.toLowerCase() === selectedTech.toLowerCase()))
      return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.abstract.toLowerCase().includes(q) ||
        item.authors.some((a) => a.toLowerCase().includes(q)) ||
        (item.supervisorName && item.supervisorName.toLowerCase().includes(q)) ||
        item.technologies.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const allTechnologies = Array.from(
    new Set(fyps.flatMap((f) => f.technologies))
  ).slice(0, 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white rounded-xl p-8 border border-emerald-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>KIU Undergraduate Capstone Archive</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            Final Year Project (FYP) Discovery System
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 font-light mt-2 leading-relaxed">
            Search previous KIU final year projects across engineering, computer science, and life sciences. Inspect supervisor methodologies and avoid duplicating previous topics with semantic similarity analysis.
          </p>
        </div>

        <button
          onClick={() => onNavigate('fyp-advisor')}
          className="px-5 py-3 bg-white text-emerald-950 hover:bg-emerald-50 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <span>Find Your FYP Topic (AI)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-lg border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FYPs by title, technology, supervisor, or student author..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="flex-1 sm:flex-none p-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200"
            >
              <option value="all">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="p-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200"
            >
              <option value="all">All Technologies</option>
              {allTechnologies.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FYP Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-stone-500">
          <Sparkles className="w-5 h-5 text-emerald-700 animate-spin mx-auto mb-2" />
          <span>Loading KIU Final Year Projects...</span>
        </div>
      ) : filteredFyps.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-8 space-y-2">
          <GraduationCap className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="font-serif text-base font-bold text-stone-800 dark:text-stone-200">
            No FYPs found matching these filters.
          </h3>
          <p className="text-xs text-stone-500">
            Try resetting filters or searching with a broader technology term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFyps.map((fyp) => (
            <div
              key={fyp.id}
              className="p-6 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-700/60 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Metadata Line */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                      FYP Capstone
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{fyp.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{fyp.departmentName}</span>
                  </div>
                  {fyp.verificationStatus === 'Verified Research' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Under Review</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3
                  onClick={() => onViewFyp(fyp.id)}
                  className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 dark:hover:text-emerald-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                >
                  {fyp.title}
                </h3>

                {/* Author & Supervisor */}
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1.5">
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    Students: {fyp.authors.join(', ')}
                  </span>
                  {fyp.supervisorName && (
                    <span className="block text-stone-500 mt-0.5">
                      Supervisor: {fyp.supervisorName}
                    </span>
                  )}
                </div>

                {/* Abstract */}
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {fyp.abstract}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  <span className="font-sans text-stone-400">Stack:</span>
                  {fyp.technologies.map((t, idx) => (
                    <span key={t}>
                      {t}
                      {idx < fyp.technologies.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleInspectSimilarity(fyp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-all font-medium cursor-pointer active:scale-95"
                >
                  <Layers className="w-3.5 h-3.5 text-stone-500" />
                  <span>Similar Projects</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskAi(fyp)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded transition-all cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask AI</span>
                  </button>
                  <button
                    onClick={() => onViewFyp(fyp.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Similarity Inspection Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Topic Overlap & Similarity Analysis
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  Projects Similar to "{inspectingItem.title}"
                </h3>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400">
              Similarity scores represent conceptual and technical affinity within the KIU repository. Use this to ensure your proposed FYP offers novel contributions without repeating established work.
            </p>

            {similarLoading ? (
              <div className="py-8 text-center text-xs text-stone-500">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin mx-auto mb-2" />
                <span>Calculating semantic similarity scores...</span>
              </div>
            ) : similarResults.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-500">
                No high-overlap projects identified in the current repository records.
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {similarResults.map((res) => (
                  <div
                    key={res.project.id}
                    className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 flex items-start justify-between gap-3"
                  >
                    <div>
                      <h4
                        onClick={() => {
                          onViewFyp(res.project.id);
                          setInspectingItem(null);
                        }}
                        className="text-xs font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 cursor-pointer"
                      >
                        {res.project.title}
                      </h4>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {res.project.departmentName} · {res.project.year} · By {res.project.authors.join(', ')}
                      </div>
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-1">
                        Reasons: {res.matchingReasons.join(' · ')}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                        {res.similarityScore}%
                      </div>
                      <div className="text-[10px] text-stone-400">Similarity score</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setInspectingItem(null)}
                className="px-4 py-1.5 text-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded font-medium cursor-pointer active:scale-95 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
