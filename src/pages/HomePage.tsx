import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Building,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Compass,
  FileCheck,
  X,
} from 'lucide-react';
import { ResearchItem, Department, Faculty } from '../types';
import { ResearchCard } from '../components/ResearchCard';
import { api } from '../services/api';
import { RESEARCH_TOPICS_LIST, OFFICIAL_KIU_RESOURCES } from '../data/kiuData';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
  onAskAi: (item: ResearchItem) => void;
  onOpenPdf: (item: ResearchItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onAskAi,
  onOpenPdf,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredResearch, setFeaturedResearch] = useState<ResearchItem[]>([]);
  const [latestResearch, setLatestResearch] = useState<ResearchItem[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyTab, setSelectedFacultyTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [featRes, latestRes, stats, depts, facs] = await Promise.all([
          api.getResearch({ isFeatured: true, limit: 3 }),
          api.getResearch({ sort: 'recent', limit: 4 }),
          api.getAnalytics(),
          api.getDepartments(),
          api.getFaculties(),
        ]);
        setFeaturedResearch(featRes.items);
        setLatestResearch(latestRes.items);
        setAnalytics(stats);
        setDepartments(depts);
        setFaculties(facs);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('research', `search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('research');
    }
  };

  const filteredDepts =
    selectedFacultyTab === 'all'
      ? departments.slice(0, 9)
      : departments.filter((d) => d.facultyId === selectedFacultyTab);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        {/* Background Image with Measured Scrim Overlay for WCAG AA Contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/kiu_research_hero_1791210896818.jpg"
            alt="Karakoram International University campus in Gilgit with mountain backdrop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transform opacity-30 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/85 to-stone-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            {/* Academic Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 sm:mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Karakoram International University · Gilgit-Baltistan</span>
            </div>

            {/* Main Hero Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-3 sm:mb-4">
              KIU ResearchHub
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-300 leading-relaxed font-light mb-6 sm:mb-8 max-w-2xl">
              Discover, explore and connect with research at Karakoram International University. A centralized repository for Final Year Projects, graduate theses, and verified regional publications.
            </p>

            {/* Hero Search Box */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white/10 dark:bg-stone-900/80 backdrop-blur-md rounded-lg border border-stone-700/60 shadow-xl max-w-2xl">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-4 h-4 text-stone-300 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FYPs, theses, research papers, topics..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-stone-300 focus:outline-none py-1.5"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search input"
                      className="p-1 text-stone-400 hover:text-white mr-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Search Repository</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => onNavigate('research')}
                className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-900 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-800" />
                <span>Explore Research</span>
              </button>
              <button
                onClick={() => onNavigate('ai-assistant')}
                className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Research Assistant</span>
              </button>
              <button
                onClick={() => onNavigate('fyp-advisor')}
                className="px-4 py-2 bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Find Your FYP Topic</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Research Statistics Strip (Every card is clickable and navigates!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-md p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          <div
            onClick={() => onNavigate('research')}
            className="p-2 -m-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition-colors group"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Total Research
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
              {analytics.totalResearch || '8'}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Archived works →</div>
          </div>

          <div
            onClick={() => onNavigate('fyp')}
            className="p-2 -m-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition-colors group"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Total FYPs
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-emerald-800 dark:text-emerald-400 mt-1 tabular-nums">
              {analytics.totalFyps || '3'}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Capstone projects →</div>
          </div>

          <div
            onClick={() => onNavigate('research', 'type=Thesis')}
            className="p-2 -m-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition-colors group"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Theses
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
              {analytics.totalTheses || '2'}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">MS & PhD dissertations →</div>
          </div>

          <div
            onClick={() => onNavigate('research', 'type=Publication')}
            className="p-2 -m-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition-colors group"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Publications
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
              {analytics.totalPublications || '3'}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Faculty papers →</div>
          </div>

          <div
            onClick={() => onNavigate('departments')}
            className="p-2 -m-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition-colors group"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Departments
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
              {analytics.totalDepartments || '24'}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Verified faculties →</div>
          </div>

          <div
            onClick={() => onNavigate('researchers')}
            className="p-2 -m-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition-colors group"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
              Researchers
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums group-hover:text-emerald-800 dark:group-hover:text-emerald-400">
              {analytics.totalResearchers || '6'}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Verified faculty →</div>
          </div>
        </div>
      </section>

      {/* Featured Research Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Curated Scholarly Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
              Featured KIU Research
            </h2>
          </div>
          <button
            onClick={() => onNavigate('research')}
            className="text-xs font-medium text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
          >
            <span>Explore all repository works</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResearch.map((item) => (
            <ResearchCard
              key={item.id}
              item={item}
              onView={(id) => onNavigate('research-detail', id)}
              onAskAi={(itm) => onAskAi(itm)}
            />
          ))}
        </div>
      </section>

      {/* High-Impact Regional Research Priorities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 border-b border-stone-200 dark:border-stone-800 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Regional Focus Areas
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Gilgit-Baltistan Research Priorities
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Critical academic thrusts addressing the unique environmental, geographical, and technological context of the Karakoram and western Himalayas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Mountain Hazards & Glaciology */}
          <div
            onClick={() => onNavigate('research', 'topic=Mountain Hazards')}
            className="group relative overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs cursor-pointer hover:border-emerald-700/60 transition-all flex flex-col active:scale-[0.99]"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/mountain_hazards_station_1791210912876.jpg"
                alt="Mountain hazards research in Karakoram"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs font-serif font-bold text-white">
                Earth & Cryosphere
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  Glacial Hazards & GLOF Early Warning
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                  Satellite InSAR telemetry, glacier surge monitoring (Shisper, Passu), rockfall sensors, and hydrological discharge risk modeling along the Karakoram Highway.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                <span>View Glaciology Research</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: AI & Agricultural Technology */}
          <div
            onClick={() => onNavigate('research', 'topic=Agricultural')}
            className="group relative overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs cursor-pointer hover:border-emerald-700/60 transition-all flex flex-col active:scale-[0.99]"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/ai_agri_research_1791210927212.jpg"
                alt="AI agriculture research in Gilgit orchard"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs font-serif font-bold text-white">
                Computational Agriculture
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  Deep Learning for Mountain Orchards
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                  Mobile edge-vision models for apricot gummosis detection, drone multispectral crop health analytics, and blockchain traceability for dried fruit exports.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                <span>View Agri-AI Projects</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Alpine Clean Energy & Microgrids */}
          <div
            onClick={() => onNavigate('research', 'topic=Renewable Energy')}
            className="group relative overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs cursor-pointer hover:border-emerald-700/60 transition-all flex flex-col active:scale-[0.99]"
          >
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/clean_energy_station_1791210943851.jpg"
                alt="Alpine renewable energy station in Gilgit-Baltistan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs font-serif font-bold text-white">
                Engineering & Energy
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  High-Altitude Renewable Microgrids
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                  Hybrid solar-PV and run-of-the-river micro-hydro systems engineered to prevent winter freezing drop-offs and stabilize remote valley electricity networks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                <span>View Clean Energy Research</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research by Department & Faculty */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Institutional Structure
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Explore Research by Department
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Grounded directly in the official KIU departments page (
            <a
              href="https://www.kiu.edu.pk/departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-400 underline"
            >
              kiu.edu.pk/departments
            </a>
            ).
          </p>

          {/* Faculty Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 p-1 bg-stone-100 dark:bg-stone-800/60 rounded-lg max-w-fit">
            <button
              onClick={() => setSelectedFacultyTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer active:scale-95 ${
                selectedFacultyTab === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              All Faculties
            </button>
            {faculties.map((fac) => (
              <button
                key={fac.id}
                onClick={() => setSelectedFacultyTab(fac.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer active:scale-95 ${
                  selectedFacultyTab === fac.id
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {fac.name.replace('Faculty of ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              onClick={() => onNavigate('research', `dept=${dept.id}`)}
              className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-700/50 cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between active:scale-[0.99]"
            >
              <div>
                <div className="text-[11px] text-stone-400 truncate">
                  {dept.facultyName}
                </div>
                <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors mt-0.5">
                  {dept.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-mono text-[11px] truncate max-w-[170px]">
                  {dept.researchFocus.slice(0, 2).join(' · ')}
                </span>
                <span className="text-emerald-800 dark:text-emerald-400 font-medium shrink-0">
                  View Works →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Research Assistant Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-xl p-6 sm:p-8 lg:p-10 border border-emerald-900 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded RAG Intelligence</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-3">
              Ask Any Question Grounded in Verified KIU Research Documents
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed mb-6 font-light">
              Our academic assistant uses strictly retrieved document text and approved KIU records. Receive precise citations to exact document pages and methodology sections without AI hallucinations.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('ai-assistant')}
                className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 active:scale-95 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Launch AI Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('fyp-advisor')}
                className="px-4 py-2.5 bg-emerald-900/90 hover:bg-emerald-800 active:scale-95 text-emerald-100 border border-emerald-700/60 rounded-md text-xs font-semibold transition-all cursor-pointer"
              >
                Find Your FYP Topic
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Official KIU Portals Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-stone-200 dark:border-stone-800 pb-3 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Verified Links
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              Official KIU University Resources
            </h2>
          </div>
          <span className="text-xs text-stone-400 hidden sm:inline">
            Direct access to official university domains
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICIAL_KIU_RESOURCES.slice(0, 8).map((res) => (
            <a
              key={res.url}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-700/60 hover:shadow-xs transition-all group flex flex-col justify-between active:scale-[0.99]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                    {res.name}
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 shrink-0" />
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </div>
              <div className="mt-3 text-[11px] text-stone-400 font-mono truncate">
                {res.url.replace('https://', '')}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
