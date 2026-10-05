import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Bookmark,
  Clock,
  Eye,
  Download,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { ResearchItem } from '../types';
import { api } from '../services/api';
import { ResearchCard } from '../components/ResearchCard';

interface DashboardPageProps {
  onViewResearch: (id: string) => void;
  onAskAi: (item: ResearchItem) => void;
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onViewResearch,
  onAskAi,
  onNavigate,
}) => {
  const { user, switchUser } = useAuth();
  const { bookmarks, recentlyViewed } = useBookmarks();

  const [allResearch, setAllResearch] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getResearch({ limit: 100 });
        setAllResearch(res.items);
      } catch (err) {
        console.error('Failed to load dashboard research:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const savedItems = allResearch.filter((r) => bookmarks.includes(r.id));
  const recentItems = allResearch.filter((r) => recentlyViewed.includes(r.id));

  // Role-specific items
  const mySubmissions = allResearch.filter(
    (r) =>
      r.submittedBy === user.id ||
      r.authors.some((a) => a.toLowerCase().includes(user.name.toLowerCase()))
  );

  const supervisedProjects = allResearch.filter(
    (r) =>
      r.supervisorName &&
      r.supervisorName.toLowerCase().includes(user.name.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Welcome Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-serif text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {user.name}
              </h1>
              <span className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-800/20">
                {user.role} Portal
              </span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-x-2">
              <span>{user.email}</span>
              {user.departmentName && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{user.departmentName}</span>
                </>
              )}
              {user.studentId && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{user.studentId}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('submit')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Research</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Panels */}

      {/* 1. STUDENT VIEW */}
      {user.role === 'student' && (
        <div className="space-y-8">
          {/* Submissions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                My Uploaded Research & FYP Submissions
              </h2>
              <span className="text-xs text-stone-400">
                {mySubmissions.length} active submissions
              </span>
            </div>

            {mySubmissions.length === 0 ? (
              <div className="p-8 bg-stone-50 dark:bg-stone-900/40 rounded-lg border border-dashed border-stone-300 dark:border-stone-800 text-center space-y-2 text-xs">
                <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="font-medium text-stone-700 dark:text-stone-300">
                  You haven't submitted any research projects yet.
                </p>
                <p className="text-stone-500">
                  Submit your FYP capstone or conference draft for academic verification.
                </p>
                <button
                  onClick={() => onNavigate('submit')}
                  className="px-3.5 py-1.5 bg-emerald-800 text-white rounded text-xs font-semibold hover:bg-emerald-700 inline-block mt-1"
                >
                  Submit FYP
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {mySubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">{sub.type}</span>
                        <span>·</span>
                        <span>{sub.year}</span>
                      </div>
                      <h3
                        onClick={() => onViewResearch(sub.id)}
                        className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 cursor-pointer"
                      >
                        {sub.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                        {sub.abstract}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {sub.verificationStatus === 'Verified Research' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending Verification</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FACULTY VIEW */}
      {user.role === 'faculty' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
              <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Supervised Projects & Capstones ({supervisedProjects.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supervisedProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                      {p.type} · {p.year}
                    </span>
                    <h3
                      onClick={() => onViewResearch(p.id)}
                      className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 cursor-pointer mt-1"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Students: {p.authors.join(', ')}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-400">{p.viewsCount} views</span>
                    <button
                      onClick={() => onViewResearch(p.id)}
                      className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Review Project →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Bookmarks Section (Common to all roles) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Saved Research & Bookmarks ({savedItems.length})
            </h2>
          </div>
        </div>

        {savedItems.length === 0 ? (
          <p className="text-xs text-stone-500 italic">
            You haven't bookmarked any research works yet. Click the bookmark icon on any paper to save it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => (
              <ResearchCard
                key={item.id}
                item={item}
                onView={(id) => onViewResearch(id)}
                onAskAi={(itm) => onAskAi(itm)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recently Viewed (Continue Exploring) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400" />
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Continue Exploring — Recently Viewed
            </h2>
          </div>
        </div>

        {recentItems.length === 0 ? (
          <p className="text-xs text-stone-500 italic">No recently viewed papers.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onViewResearch(item.id)}
                className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-700/60 cursor-pointer transition-colors text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                    {item.type} · {item.departmentName}
                  </div>
                  <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 mt-1 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-3 text-[11px] text-stone-400 font-mono">
                  {item.year}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
