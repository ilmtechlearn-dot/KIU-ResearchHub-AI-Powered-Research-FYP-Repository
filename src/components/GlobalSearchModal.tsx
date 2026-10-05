import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  User,
  Building,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ResearchItem, Department, Researcher, ResearchTopic } from '../types';
import { api } from '../services/api';
import { RESEARCH_TOPICS_LIST } from '../data/kiuData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [researchResults, setResearchResults] = useState<ResearchItem[]>([]);
  const [deptResults, setDeptResults] = useState<Department[]>([]);
  const [researcherResults, setResearcherResults] = useState<Researcher[]>([]);
  const [topicResults, setTopicResults] = useState<ResearchTopic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResearchResults([]);
      setDeptResults([]);
      setResearcherResults([]);
      setTopicResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResearchResults([]);
      setDeptResults([]);
      setResearcherResults([]);
      setTopicResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query.toLowerCase().trim();

        // Fetch matching research
        const res = await api.getResearch({ search: q, limit: 5 });
        setResearchResults(res.items);

        // Match departments
        const allDepts = await api.getDepartments();
        const depts = allDepts.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.researchFocus.some((f) => f.toLowerCase().includes(q))
        );
        setDeptResults(depts.slice(0, 3));

        // Match researchers
        const allResearchers = await api.getResearchers();
        const researchers = allResearchers.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.departmentName.toLowerCase().includes(q) ||
            r.researchInterests.some((i) => i.toLowerCase().includes(q))
        );
        setResearcherResults(researchers.slice(0, 3));

        // Match topics
        const topics = RESEARCH_TOPICS_LIST.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
        );
        setTopicResults(topics.slice(0, 3));
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = [
    'Mountain hazards',
    'Apricot disease CNN',
    'Shisper glacier',
    'Shina language NLP',
    'Solar microgrid',
    'Snow leopard Khunjerab',
  ];

  const totalResults =
    researchResults.length +
    deptResults.length +
    researcherResults.length +
    topicResults.length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-stone-950/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[82vh] animate-slide-up"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3 bg-stone-50 dark:bg-stone-950/50">
          <Search className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FYPs, theses, researchers, departments, topics..."
            className="flex-1 bg-transparent text-sm sm:text-base focus:outline-none text-stone-900 dark:text-white placeholder:text-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs sm:text-sm">
          {/* Initial state: Popular Searches */}
          {!query.trim() && (
            <div className="space-y-4 py-2">
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Popular Research Topics at KIU
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {popularSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-2.5 py-1 text-xs bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  Tip:
                </span>{' '}
                Use natural language queries like <em>"AI for agriculture"</em> or{' '}
                <em>"Hunza water models"</em> to search the full-text repository.
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="py-6 text-center text-xs text-stone-500 flex items-center justify-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Searching repository...</span>
            </div>
          )}

          {/* Empty result */}
          {query.trim() && !loading && totalResults === 0 && (
            <div className="py-8 text-center text-stone-500 space-y-2">
              <p className="font-semibold text-stone-800 dark:text-stone-200">
                No matching KIU research records found for "{query}".
              </p>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try searching with broader terms like "Computer Science", "Glacier", "Agriculture", or "Energy".
              </p>
            </div>
          )}

          {/* Research Results */}
          {researchResults.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Research Documents & FYPs ({researchResults.length})</span>
              </div>
              <div className="space-y-1.5">
                {researchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onNavigate('research-detail', item.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-all flex items-start justify-between gap-3 group active:scale-[0.99]"
                  >
                    <div>
                      <div className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {item.type} · {item.departmentName} · {item.year}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Department Results */}
          {deptResults.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Departments ({deptResults.length})</span>
              </div>
              <div className="space-y-1.5">
                {deptResults.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => {
                      onNavigate('research', `dept=${dept.id}`);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-all flex items-center justify-between active:scale-[0.99]"
                  >
                    <div>
                      <div className="font-medium text-stone-900 dark:text-stone-100">
                        {dept.name}
                      </div>
                      <div className="text-xs text-stone-500">{dept.facultyName}</div>
                    </div>
                    <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                      View Projects →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Researchers Results */}
          {researcherResults.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Faculty & Researchers ({researcherResults.length})</span>
              </div>
              <div className="space-y-1.5">
                {researcherResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => {
                      onNavigate('researchers', res.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-all flex items-center justify-between active:scale-[0.99]"
                  >
                    <div>
                      <div className="font-medium text-stone-900 dark:text-stone-100">
                        {res.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        {res.designation} · {res.departmentName}
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">{res.publicationsCount} papers</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topics Results */}
          {topicResults.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Research Themes ({topicResults.length})</span>
              </div>
              <div className="space-y-1.5">
                {topicResults.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onNavigate('research', `topic=${encodeURIComponent(t.title)}`);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-all flex items-center justify-between active:scale-[0.99]"
                  >
                    <div>
                      <div className="font-medium text-stone-900 dark:text-stone-100">
                        {t.title}
                      </div>
                      <div className="text-xs text-stone-500">{t.category}</div>
                    </div>
                    <span className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                      Explore Theme →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Enter action */}
        {query.trim() && (
          <div className="p-3 bg-stone-50 dark:bg-stone-950/60 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
            <span>
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} in repository
            </span>
            <button
              onClick={() => {
                onNavigate('research', `search=${encodeURIComponent(query)}`);
                onClose();
              }}
              className="text-emerald-800 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all research matching "{query}"</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
