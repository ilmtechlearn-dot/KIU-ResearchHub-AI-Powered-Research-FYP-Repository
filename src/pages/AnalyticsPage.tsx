import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  Download,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api';

interface AnalyticsPageProps {
  onViewResearch: (id: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onViewResearch,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAnalytics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-stone-500">
        <Sparkles className="w-5 h-5 text-emerald-700 animate-spin mx-auto mb-2" />
        <span>Aggregating repository statistics...</span>
      </div>
    );
  }

  const maxDeptCount = Math.max(
    1,
    ...(stats?.researchByDepartment || []).map((d: any) => d.count)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Institutional Repository Metrics
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          KIU Research & Capstone Analytics
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
          Real-time metrics computed directly from active database records across all university faculties and departments.
        </p>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Total Repository Records</div>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {stats.totalResearch}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Cataloged academic projects</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Undergraduate FYPs</div>
          <div className="text-3xl font-serif font-bold text-emerald-800 dark:text-emerald-400 mt-1 tabular-nums">
            {stats.totalFyps}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Capstone projects</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Theses & Dissertations</div>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {stats.totalTheses}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Graduate research</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Peer Publications</div>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
            {stats.totalPublications}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Faculty journal papers</div>
        </div>
      </div>

      {/* Two Column Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Research by Department (Bar Chart) */}
        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <h2 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
              Research Distribution by Department
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {stats.researchByDepartment.map((d: any) => {
              const pct = Math.round((d.count / maxDeptCount) * 100);
              return (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between items-center text-stone-700 dark:text-stone-300">
                    <span className="font-medium truncate pr-2">{d.name}</span>
                    <span className="font-mono tabular-nums text-stone-500 shrink-0">
                      {d.count} work{d.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-emerald-800 dark:bg-emerald-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Research by Type (Distribution) */}
        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <PieChart className="w-4 h-4 text-emerald-700" />
            <h2 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
              Repository Breakdown by Academic Format
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {stats.researchByType.map((t: any) => (
              <div
                key={t.type}
                className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700"
              >
                <div className="text-stone-500 font-medium">{t.type}</div>
                <div className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
                  {t.count}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {Math.round((t.count / stats.totalResearch) * 100)}% of repository
                </div>
              </div>
            ))}
          </div>

          {/* Research by Year Trend */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">
              Publication Cohort by Year
            </span>
            <div className="flex items-end gap-3 h-24 pt-4">
              {stats.researchByYear.map((y: any) => (
                <div key={y.year} className="flex-1 flex flex-col items-center gap-1">
                  <span className="font-mono text-[10px] text-stone-500 tabular-nums">
                    {y.count}
                  </span>
                  <div
                    style={{ height: `${(y.count / stats.totalResearch) * 60 + 10}px` }}
                    className="w-full bg-emerald-800/80 rounded-t transition-all"
                  />
                  <span className="font-mono text-[11px] text-stone-400 tabular-nums">
                    {y.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Most Viewed and Downloaded Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Most Viewed */}
        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <Eye className="w-4 h-4 text-emerald-700" />
            <h2 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
              Most Accessed Research Papers
            </h2>
          </div>
          <div className="space-y-2">
            {stats.mostViewed.map((item: any, idx: number) => (
              <div
                key={item.id}
                onClick={() => onViewResearch(item.id)}
                className="flex items-center justify-between p-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors"
              >
                <div className="truncate pr-3">
                  <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {idx + 1}. {item.title}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {item.type} · {item.department}
                  </div>
                </div>
                <div className="font-mono tabular-nums text-emerald-800 dark:text-emerald-400 font-bold shrink-0">
                  {item.viewsCount} views
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Downloaded */}
        <div className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <Download className="w-4 h-4 text-emerald-700" />
            <h2 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
              Most Downloaded Academic Manuscripts
            </h2>
          </div>
          <div className="space-y-2">
            {stats.mostDownloaded.map((item: any, idx: number) => (
              <div
                key={item.id}
                onClick={() => onViewResearch(item.id)}
                className="flex items-center justify-between p-2 rounded hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors"
              >
                <div className="truncate pr-3">
                  <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {idx + 1}. {item.title}
                  </div>
                  <div className="text-[11px] text-stone-500">{item.type}</div>
                </div>
                <div className="font-mono tabular-nums text-emerald-800 dark:text-emerald-400 font-bold shrink-0">
                  {item.downloadsCount} downloads
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
