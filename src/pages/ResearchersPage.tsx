import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ExternalLink,
  BookOpen,
  Mail,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Researcher, Department } from '../types';
import { api } from '../services/api';

interface ResearchersPageProps {
  onSelectResearcher?: (researcher: Researcher) => void;
  onViewDepartment?: (deptId: string) => void;
}

export const ResearchersPage: React.FC<ResearchersPageProps> = ({
  onViewDepartment,
}) => {
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resList, depts] = await Promise.all([
          api.getResearchers(),
          api.getDepartments(),
        ]);
        setResearchers(resList);
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load researchers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = researchers.filter((r) => {
    if (selectedDept !== 'all' && r.departmentId !== selectedDept) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.departmentName.toLowerCase().includes(q) ||
        r.designation.toLowerCase().includes(q) ||
        r.researchInterests.some((i) => i.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Faculty & Scholar Directory
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          KIU Faculty & Principal Investigators
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          Directory of verified Karakoram International University faculty supervisors and principal researchers compiled from official KIU public listings.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-lg border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty by name, department, or research domain..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900 dark:text-white"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="p-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200 w-full sm:w-auto"
        >
          <option value="all">All Academic Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-stone-500">
          <Sparkles className="w-5 h-5 text-emerald-700 animate-spin mx-auto mb-2" />
          <span>Loading verified KIU faculty profiles...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-stone-500 text-xs">
          No faculty members found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <div
              key={res.id}
              className="p-6 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                      {res.name}
                    </h3>
                    <div className="text-xs text-emerald-800 dark:text-emerald-400 font-medium mt-0.5">
                      {res.designation}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-800/10 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    {res.name.replace('Dr. ', '').replace('Engr. ', '').charAt(0)}
                  </div>
                </div>

                <div className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                  <span>{res.departmentName}</span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
                  {res.bio}
                </p>

                {/* Research Interests */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Research Specializations
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px] text-stone-600 dark:text-stone-300 font-mono">
                    {res.researchInterests.map((interest, idx) => (
                      <span key={interest}>
                        {interest}
                        {idx < res.researchInterests.length - 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom stats and official link */}
              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-stone-500">
                  <span>
                    <strong className="text-stone-800 dark:text-stone-200">{res.publicationsCount}</strong> papers
                  </span>
                  <span>
                    <strong className="text-stone-800 dark:text-stone-200">{res.supervisedCount}</strong> FYPs
                  </span>
                </div>

                <a
                  href={res.officialProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 hover:underline font-semibold"
                >
                  <span>Official Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
