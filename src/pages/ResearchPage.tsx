import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  RotateCcw,
  Sparkles,
  ChevronDown,
  BookOpen,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { ResearchItem, Department, Faculty, ResearchType, VerificationStatus } from '../types';
import { ResearchCard } from '../components/ResearchCard';
import { api } from '../services/api';
import { RESEARCH_TOPICS_LIST } from '../data/kiuData';
import { useToast } from '../context/ToastContext';

interface ResearchPageProps {
  initialSearch?: string;
  initialDepartment?: string;
  initialType?: string;
  initialTopic?: string;
  onViewResearch: (id: string) => void;
  onAskAi: (item: ResearchItem) => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({
  initialSearch = '',
  initialDepartment = 'all',
  initialType = 'all',
  initialTopic = 'all',
  onViewResearch,
  onAskAi,
}) => {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [selectedDept, setSelectedDept] = useState(initialDepartment);
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sort, setSort] = useState<'recent' | 'views' | 'citations' | 'year'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Metadata catalogs
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [depts, facs] = await Promise.all([
          api.getDepartments(),
          api.getFaculties(),
        ]);
        setDepartments(depts);
        setFaculties(facs);
      } catch (e) {
        console.error('Failed to load catalogs:', e);
      }
    }
    loadCatalogs();
  }, []);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const res = await api.getResearch({
        search: search.trim() || undefined,
        departmentId: selectedDept !== 'all' ? selectedDept : undefined,
        facultyId: selectedFaculty !== 'all' ? selectedFaculty : undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        year: selectedYear !== 'all' ? parseInt(selectedYear, 10) : undefined,
        topic: selectedTopic !== 'all' ? selectedTopic : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        sort,
        limit: 50,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to fetch research:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, [
    search,
    selectedDept,
    selectedFaculty,
    selectedType,
    selectedYear,
    selectedTopic,
    selectedStatus,
    sort,
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedDept('all');
    setSelectedFaculty('all');
    setSelectedType('all');
    setSelectedYear('all');
    setSelectedTopic('all');
    setSelectedStatus('all');
    setSort('recent');
    showToast('Filters Cleared', 'Reset all research filters', 'info');
  };

  const researchTypes: ResearchType[] = [
    'FYP',
    'Thesis',
    'Research Paper',
    'Publication',
    'Project',
    'Dataset',
    'Conference Paper',
  ];

  const years = [2026, 2025, 2024, 2023, 2022];

  const activeFilterCount =
    (search ? 1 : 0) +
    (selectedDept !== 'all' ? 1 : 0) +
    (selectedFaculty !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (selectedYear !== 'all' ? 1 : 0) +
    (selectedTopic !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0);

  const getDeptName = (id: string) => {
    const d = departments.find((dept) => dept.id === id);
    return d ? d.name : id;
  };

  const getFacultyName = (id: string) => {
    const f = faculties.find((fac) => fac.id === id);
    return f ? f.name.replace('Faculty of ', '') : id;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Title & Controls */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Repository Discovery
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Explore KIU Research & FYPs
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            Search across undergraduate Final Year Projects, graduate theses, and verified faculty publications from Karakoram International University.
          </p>
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-md border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-800 dark:text-stone-200 cursor-pointer"
          >
            <option value="recent">Sort: Most Recent</option>
            <option value="views">Sort: Most Viewed</option>
            <option value="citations">Sort: Most Cited</option>
            <option value="year">Sort: By Year</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-800/20 rounded-md"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, project titles, supervisors, technologies, or datasets..."
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid (Collapsible on mobile) */}
        <div className={`${mobileFiltersOpen ? 'grid' : 'hidden md:grid'} grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs pt-1`}>
          {/* Faculty */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none truncate text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Faculties</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name.replace('Faculty of ', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none truncate text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Work Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Types</option>
              {researchTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Years</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Research Topic */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Research Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Topics</option>
              {RESEARCH_TOPICS_LIST.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Verification
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Official KIU Source">Official KIU Source</option>
              <option value="Verified Research">Verified Research</option>
              <option value="Pending Verification">Pending Verification</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips & Clear Action */}
        {activeFilterCount > 0 && (
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-stone-400 font-medium mr-1">Active:</span>

              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs">
                  <span>"{search}"</span>
                  <button onClick={() => setSearch('')} className="hover:text-stone-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedDept !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs">
                  <span>Dept: {getDeptName(selectedDept)}</span>
                  <button onClick={() => setSelectedDept('all')} className="hover:text-emerald-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedFaculty !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs">
                  <span>Faculty: {getFacultyName(selectedFaculty)}</span>
                  <button onClick={() => setSelectedFaculty('all')} className="hover:text-emerald-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs">
                  <span>Type: {selectedType}</span>
                  <button onClick={() => setSelectedType('all')} className="hover:text-stone-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedYear !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs">
                  <span>Year: {selectedYear}</span>
                  <button onClick={() => setSelectedYear('all')} className="hover:text-stone-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTopic !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs">
                  <span>Topic: {selectedTopic}</span>
                  <button onClick={() => setSelectedTopic('all')} className="hover:text-stone-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs">
                  <span>Status: {selectedStatus}</span>
                  <button onClick={() => setSelectedStatus('all')} className="hover:text-stone-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-medium hover:underline cursor-pointer active:scale-95 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Showing count */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          Showing <strong>{items.length}</strong> of <strong>{total}</strong> verified works
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-xs text-stone-500 flex flex-col items-center justify-center gap-3 animate-pulse">
          <Sparkles className="w-6 h-6 text-emerald-700 animate-spin" />
          <span>Querying KIU research repository...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-8 space-y-3 shadow-xs">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="font-serif text-base font-bold text-stone-800 dark:text-stone-200">
            No research records match your current criteria.
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting "All Departments", or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-all inline-block cursor-pointer active:scale-95 shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Research Items View */}
      {!loading && items.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {items.map((item) => (
            <ResearchCard
              key={item.id}
              item={item}
              layout={viewMode}
              onView={(id) => onViewResearch(id)}
              onAskAi={(itm) => onAskAi(itm)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
