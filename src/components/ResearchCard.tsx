import React from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { ResearchItem } from '../types';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';

interface ResearchCardProps {
  item: ResearchItem;
  onView: (id: string) => void;
  onAskAi: (item: ResearchItem) => void;
  layout?: 'grid' | 'list';
}

export const ResearchCard: React.FC<ResearchCardProps> = ({
  item,
  onView,
  onAskAi,
  layout = 'grid',
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();
  const bookmarked = isBookmarked(item.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(item.id);
    if (!bookmarked) {
      showToast('Saved to Bookmarks', `"${item.title.slice(0, 45)}..." saved`, 'success');
    } else {
      showToast('Removed Bookmark', 'Removed from saved research list', 'info');
    }
  };

  // Status Badge Rendering with accessible text and clear icon
  const renderStatusBadge = () => {
    switch (item.verificationStatus) {
      case 'Official KIU Source':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>Official KIU Source</span>
          </span>
        );
      case 'Verified Research':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 dark:text-stone-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Verified Research</span>
          </span>
        );
      case 'Pending Verification':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Pending Verification</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Revision Requested</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (layout === 'list') {
    return (
      <article className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-700/50 dark:hover:border-emerald-600/50 transition-all duration-200 hover:shadow-xs group">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Zero-Pill Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
              <span className="font-semibold text-emerald-800 dark:text-emerald-400">{item.type}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[200px]">{item.departmentName}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">{item.year}</span>
              {item.isDemoData && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] text-stone-400 italic">Demo Record</span>
                </>
              )}
            </div>

            {/* Title */}
            <h3
              onClick={() => onView(item.id)}
              className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 dark:hover:text-emerald-400 cursor-pointer transition-colors leading-snug line-clamp-2"
            >
              {item.title}
            </h3>

            {/* Authors & Supervisor */}
            <div className="text-xs text-stone-600 dark:text-stone-300 mt-1">
              <span>By {item.authors.join(', ')}</span>
              {item.supervisorName && (
                <span className="text-stone-400 dark:text-stone-500 ml-1.5">
                  · Supervised by {item.supervisorName}
                </span>
              )}
            </div>

            {/* Abstract excerpt */}
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
              {item.abstract}
            </p>

            {/* Technologies unboxed */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] font-mono text-stone-500 dark:text-stone-400">
              <span className="text-stone-400 font-sans text-xs">Stack:</span>
              {item.technologies.slice(0, 4).map((tech, idx) => (
                <span key={tech}>
                  {tech}
                  {idx < Math.min(item.technologies.length, 4) - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Right Action Column */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800 mt-2 sm:mt-0">
            <div className="flex items-center gap-2">{renderStatusBadge()}</div>
            <div className="flex items-center gap-1.5 mt-auto">
              <button
                onClick={handleBookmarkClick}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark research'}
                title={bookmarked ? 'Remove bookmark' : 'Bookmark research'}
                className={`p-1.5 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer active:scale-90 ${
                  bookmarked ? 'text-emerald-700 dark:text-emerald-400' : ''
                }`}
              >
                {bookmarked ? <BookmarkCheck className="w-4 h-4 fill-emerald-600/20" /> : <Bookmark className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onAskAi(item)}
                aria-label="Ask AI about this research"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask AI</span>
              </button>
              <button
                onClick={() => onView(item.id)}
                className="px-3 py-1 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-all cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid view (Standard card)
  return (
    <article className="flex flex-col h-full bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-emerald-700/50 dark:hover:border-emerald-600/50 transition-all duration-200 hover:shadow-xs p-5 group">
      {/* Top Metadata Line */}
      <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-semibold text-emerald-800 dark:text-emerald-400 shrink-0">
            {item.type}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-mono">{item.year}</span>
          {item.isDemoData && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[11px] text-stone-400 italic">Demo Record</span>
            </>
          )}
        </div>
        <button
          onClick={handleBookmarkClick}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark research'}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark research'}
          className={`p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded hover:bg-stone-50 dark:hover:bg-stone-800 transition-all cursor-pointer active:scale-90 ${
            bookmarked ? 'text-emerald-700 dark:text-emerald-400' : ''
          }`}
        >
          {bookmarked ? <BookmarkCheck className="w-4 h-4 fill-emerald-600/20" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Title */}
      <h3
        onClick={() => onView(item.id)}
        className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 hover:text-emerald-800 dark:hover:text-emerald-400 cursor-pointer transition-colors leading-snug line-clamp-2 mb-1.5"
      >
        {item.title}
      </h3>

      {/* Department & Authors */}
      <div className="text-xs text-stone-600 dark:text-stone-400 mb-2.5">
        <div className="font-medium text-stone-700 dark:text-stone-300 truncate">
          {item.departmentName}
        </div>
        <div className="text-[11px] text-stone-500 truncate mt-0.5">
          By {item.authors.join(', ')}
        </div>
      </div>

      {/* Abstract */}
      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-4 flex-grow">
        {item.abstract}
      </p>

      {/* Technologies monospace unboxed */}
      {item.technologies.length > 0 && (
        <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate mb-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          {item.technologies.slice(0, 3).join(' · ')}
        </div>
      )}

      {/* Bottom Status & Actions */}
      <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
        <div>{renderStatusBadge()}</div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAskAi(item)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ask AI</span>
          </button>
          <button
            onClick={() => onView(item.id)}
            className="px-2.5 py-1 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded transition-all cursor-pointer active:scale-95"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
};
