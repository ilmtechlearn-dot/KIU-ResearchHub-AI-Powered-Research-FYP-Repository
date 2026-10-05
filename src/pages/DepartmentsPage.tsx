import React, { useState, useEffect } from 'react';
import { Building, ExternalLink, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Department, Faculty } from '../types';
import { api } from '../services/api';

interface DepartmentsPageProps {
  onSelectDepartment: (deptId: string) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  onSelectDepartment,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [depts, facs] = await Promise.all([
          api.getDepartments(),
          api.getFaculties(),
        ]);
        setDepartments(depts);
        setFaculties(facs);
      } catch (e) {
        console.error('Failed to load departments:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredDepts =
    selectedFaculty === 'all'
      ? departments
      : departments.filter((d) => d.facultyId === selectedFaculty);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Official University Faculties & Departments
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          Academic Structure of Karakoram International University
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          Sourced directly from the official KIU departments directory (
          <a
            href="https://www.kiu.edu.pk/departments"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 dark:text-emerald-400 underline"
          >
            kiu.edu.pk/departments
          </a>
          ). Explore research concentrations and active student capstone themes.
        </p>

        {/* Faculty Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg max-w-fit text-xs">
          <button
            onClick={() => setSelectedFaculty('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer active:scale-95 ${
              selectedFaculty === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            All Faculties ({departments.length})
          </button>
          {faculties.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFaculty(f.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer active:scale-95 ${
                selectedFaculty === f.id
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {f.name.replace('Faculty of ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="p-6 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                {dept.facultyName}
              </div>
              <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-1 leading-snug">
                {dept.name}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                {dept.description}
              </p>

              {/* Research Focus List */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Core Research Concentrations
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-stone-600 dark:text-stone-300">
                  {dept.researchFocus.map((focus, idx) => (
                    <span key={focus}>
                      {focus}
                      {idx < dept.researchFocus.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <a
                href={dept.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-stone-500 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors"
              >
                <span>Official KIU Page</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => onSelectDepartment(dept.id)}
                className="flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer active:scale-95 transition-transform"
              >
                <span>Browse Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
