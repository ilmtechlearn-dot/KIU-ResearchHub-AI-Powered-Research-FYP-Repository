import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Download,
  Share2,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Layers,
  Quote,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { ResearchItem, SimilarProjectResult } from '../types';
import { api } from '../services/api';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';

interface ResearchDetailPageProps {
  id: string;
  onOpenPdf: (item: ResearchItem, page?: number) => void;
  onAskAi: (item: ResearchItem) => void;
  onViewOther: (id: string) => void;
  onBack?: () => void;
}

export const ResearchDetailPage: React.FC<ResearchDetailPageProps> = ({
  id,
  onOpenPdf,
  onAskAi,
  onViewOther,
  onBack,
}) => {
  const [research, setResearch] = useState<ResearchItem | null>(null);
  const [similar, setSimilar] = useState<SimilarProjectResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'summary' | 'citation'>('details');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const { isBookmarked, toggleBookmark, addToRecentlyViewed } = useBookmarks();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      try {
        const item = await api.getResearchById(id);
        if (item) {
          setResearch(item);
          addToRecentlyViewed(item.id);
          api.recordView(item.id);

          const sim = await api.getSimilarResearch(item.id, 3);
          setSimilar(sim);
        }
      } catch (err) {
        console.error('Failed to load research item:', err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  const handleGenerateSummary = async () => {
    if (!research || aiSummary || summaryLoading) return;
    setSummaryLoading(true);
    try {
      const summary = await api.summarizeResearch(research.id);
      setAiSummary(summary);
      showToast('AI Summary Ready', 'Executive academic summary synthesized', 'success');
    } catch {
      setAiSummary(research.abstract);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleBookmarkToggle = () => {
    if (!research) return;
    toggleBookmark(research.id);
    if (!bookmarked) {
      showToast('Bookmarked', `"${research.title.slice(0, 40)}..." saved`, 'success');
    } else {
      showToast('Bookmark Removed', 'Removed from saved research list', 'info');
    }
  };

  const handleDownload = () => {
    if (!research) return;
    api.recordDownload(research.id);
    showToast('Download Started', `Downloading manuscript for ${research.slug}.txt`, 'success');
    const element = document.createElement('a');
    const file = new Blob(
      [
        `KARAKORAM INTERNATIONAL UNIVERSITY (KIU) RESEARCH REPOSITORY\n\n` +
          `Title: ${research.title}\n` +
          `Authors: ${research.authors.join(', ')}\n` +
          `Department: ${research.departmentName}\n` +
          `Supervisor: ${research.supervisorName || 'N/A'}\n` +
          `Year: ${research.year}\n` +
          `Status: ${research.verificationStatus}\n\n` +
          `ABSTRACT:\n${research.abstract}\n\n` +
          `METHODOLOGY:\n${research.methodology}\n\n` +
          `RESULTS:\n${research.resultsSummary}\n\n` +
          `LIMITATIONS:\n${research.limitations}\n\n` +
          `FUTURE WORK:\n${research.futureWork}\n\n` +
          `OFFICIAL SOURCE: ${research.sourceUrl}\n`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${research.slug}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    showToast('Citation Copied', `${format.toUpperCase()} format copied to clipboard`, 'success');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-xs text-stone-500 animate-pulse">
        <Sparkles className="w-6 h-6 text-emerald-700 animate-spin mx-auto mb-3" />
        <span>Loading academic research record...</span>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
          Research Record Not Found
        </h2>
        <p className="text-xs text-stone-500">
          Information not available from the official KIU source.
        </p>
        <button
          onClick={() => (onBack ? onBack() : window.history.back())}
          className="px-4 py-2 bg-emerald-800 text-white rounded text-xs font-semibold cursor-pointer active:scale-95"
        >
          Return to Research Explorer
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(research.id);

  // Citation Formats
  const apaCitation = `${research.authors.join(', ')} (${research.year}). ${research.title}. Karakoram International University ResearchHub, ${research.departmentName}. ${research.sourceUrl}`;
  const ieeeCitation = `[1] ${research.authors.join(', ')}, "${research.title}," ${research.departmentName}, Karakoram International University, Gilgit, Pakistan, ${research.year}.`;
  const bibtexCitation = `@article{kiu_${research.slug.replace(/-/g, '_')},\n  title={${research.title}},\n  author={${research.authors.join(' and ')}},\n  year={${research.year}},\n  institution={Karakoram International University},\n  department={${research.departmentName}}\n}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Back button and navigation breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          onClick={() => (onBack ? onBack() : window.history.back())}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Research Explorer</span>
        </button>

        <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500 dark:text-stone-400">
          <span className="font-semibold text-emerald-800 dark:text-emerald-400">
            {research.type}
          </span>
          <span aria-hidden="true">·</span>
          <span>{research.departmentName}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-mono">{research.year}</span>
        </div>
      </div>

      {/* Main Grid: Body (Col 8) + Sidebar (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Content Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
            {research.title}
          </h1>

          {/* Authors & Supervisor */}
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="font-medium text-stone-800 dark:text-stone-200">
              Authors: <span className="font-semibold">{research.authors.join(', ')}</span>
            </div>
            {research.supervisorName && (
              <div className="text-stone-600 dark:text-stone-400">
                Supervisor: <span>{research.supervisorName}</span>
              </div>
            )}
          </div>

          {/* Action Ribbon: PDF Preview, Ask AI, Save, Download */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-b border-stone-200 dark:border-stone-800 py-3">
            <button
              onClick={() => onOpenPdf(research)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Read Full PDF</span>
            </button>

            <button
              onClick={() => onAskAi(research)}
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 text-emerald-800 dark:text-emerald-300 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI About This Paper</span>
            </button>

            <button
              onClick={handleBookmarkToggle}
              className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 text-stone-700 dark:text-stone-300 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 fill-emerald-600/20" />
                  <span>Bookmarked</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Research</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 text-stone-700 dark:text-stone-300 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Record</span>
            </button>
          </div>

          {/* Segmented Tabs: Detailed Findings | AI Summary | Citations */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-lg max-w-fit text-xs font-medium">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer active:scale-95 ${
                activeTab === 'details'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Full Academic Spec
            </button>
            <button
              onClick={() => {
                setActiveTab('summary');
                if (!aiSummary) handleGenerateSummary();
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>AI Executive Summary</span>
            </button>
            <button
              onClick={() => setActiveTab('citation')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                activeTab === 'citation'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Quote className="w-3 h-3" />
              <span>Cite This Work</span>
            </button>
          </div>

          {/* Tab 1: Full Details */}
          {activeTab === 'details' && (
            <div className="space-y-6 text-xs sm:text-sm animate-fade-in">
              {/* Abstract */}
              <div>
                <h2 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
                  Abstract
                </h2>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-serif text-justify text-sm sm:text-base">
                  {research.abstract}
                </p>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="font-serif text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-1.5">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-x-2 text-xs text-stone-600 dark:text-stone-400">
                  {research.keywords.map((k, i) => (
                    <span key={k}>
                      {k}
                      {i < research.keywords.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Methodology & Technologies */}
              <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-lg border border-stone-200 dark:border-stone-800 space-y-3">
                <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
                  Methodology & Architectural Implementation
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {research.methodology}
                </p>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                    Technology & Software Stack
                  </span>
                  <div className="font-mono text-xs text-stone-700 dark:text-stone-300">
                    {research.technologies.join(' · ')}
                  </div>
                </div>

                {research.datasetName && (
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">
                      Empirical Dataset Reference
                    </span>
                    <div className="font-medium text-stone-800 dark:text-stone-200">
                      {research.datasetName}
                    </div>
                    {research.datasetDescription && (
                      <p className="text-stone-500 text-xs mt-0.5">
                        {research.datasetDescription}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Results, Limitations & Future Work */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-lg border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-serif text-sm font-bold text-emerald-900 dark:text-emerald-400">
                    Quantitative Results
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-xs">
                    {research.resultsSummary}
                  </p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-lg border border-stone-200 dark:border-stone-800 space-y-2">
                  <h4 className="font-serif text-sm font-bold text-amber-900 dark:text-amber-400">
                    Documented Limitations
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-xs">
                    {research.limitations}
                  </p>
                </div>
              </div>

              {/* Future Directions */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-800/20 space-y-1.5">
                <h4 className="font-serif text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  Recommended Future Research Trajectories
                </h4>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-xs">
                  {research.futureWork}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: AI Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-4 p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 animate-fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    AI-Generated Executive Summary
                  </h3>
                </div>
                <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                  AI Generated Summary
                </span>
              </div>

              {summaryLoading ? (
                <div className="py-12 text-center text-xs text-stone-500 animate-pulse">
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-spin mx-auto mb-2" />
                  <span>Synthesizing academic findings with Gemini...</span>
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line font-serif">
                  {aiSummary || research.aiSummary || research.abstract}
                </div>
              )}

              <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded text-[11px] text-stone-500 border border-stone-200 dark:border-stone-800">
                <strong>Academic Notice:</strong> AI summaries are synthesized from submitted document chunks. Always inspect the primary PDF manuscript before citing in formal publications.
              </div>
            </div>
          )}

          {/* Tab 3: Citation Formats */}
          {activeTab === 'citation' && (
            <div className="space-y-4 p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-xs animate-fade-in">
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                Scholarly Citation Formats
              </h3>

              {/* APA */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-stone-500 font-semibold">
                  <span>APA (7th Edition)</span>
                  <button
                    onClick={() => copyToClipboard(apaCitation, 'apa')}
                    className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer active:scale-95"
                  >
                    {copiedFormat === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormat === 'apa' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded font-mono text-stone-800 dark:text-stone-200 select-all">
                  {apaCitation}
                </div>
              </div>

              {/* IEEE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-stone-500 font-semibold">
                  <span>IEEE</span>
                  <button
                    onClick={() => copyToClipboard(ieeeCitation, 'ieee')}
                    className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer active:scale-95"
                  >
                    {copiedFormat === 'ieee' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormat === 'ieee' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded font-mono text-stone-800 dark:text-stone-200 select-all">
                  {ieeeCitation}
                </div>
              </div>

              {/* BibTeX */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-stone-500 font-semibold">
                  <span>BibTeX</span>
                  <button
                    onClick={() => copyToClipboard(bibtexCitation, 'bibtex')}
                    className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer active:scale-95"
                  >
                    {copiedFormat === 'bibtex' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormat === 'bibtex' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded font-mono text-stone-800 dark:text-stone-200 overflow-x-auto text-[11px] select-all">
                  {bibtexCitation}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Verification & Official Source Card */}
          <div className="p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 text-xs">
            <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-2">
              Verification & Institutional Source
            </h3>

            {/* Verification Status */}
            <div>
              <span className="text-[11px] text-stone-400 block mb-1">
                Repository Status
              </span>
              <div className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{research.verificationStatus}</span>
              </div>
              {research.verifiedBy && (
                <div className="text-[11px] text-stone-500 mt-1">
                  Verified by: {research.verifiedBy}
                </div>
              )}
            </div>

            {/* Official KIU Link */}
            <div>
              <span className="text-[11px] text-stone-400 block mb-1">
                Primary Source Institution
              </span>
              <a
                href={research.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 bg-stone-50 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors group active:scale-[0.99]"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold truncate">
                    Karakoram International University
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono truncate">
                    {research.sourceUrl}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 shrink-0" />
              </a>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-center">
              <div>
                <div className="font-mono text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  {research.viewsCount}
                </div>
                <div className="text-[10px] text-stone-400">Views</div>
              </div>
              <div>
                <div className="font-mono text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  {research.downloadsCount}
                </div>
                <div className="text-[10px] text-stone-400">Downloads</div>
              </div>
              <div>
                <div className="font-mono text-base font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  {research.citationCount}
                </div>
                <div className="text-[10px] text-stone-400">Citations</div>
              </div>
            </div>
          </div>

          {/* Similar Research (Similarity Detection Feature) */}
          <div className="p-5 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
              <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
                Similar KIU Projects
              </h3>
            </div>
            <p className="text-[11px] text-stone-500">
              Evaluated across technical stack, keywords, and academic department:
            </p>

            {similar.length === 0 ? (
              <p className="text-stone-400 italic">No similar projects found.</p>
            ) : (
              <div className="space-y-3">
                {similar.map((s) => (
                  <div
                    key={s.project.id}
                    onClick={() => onViewOther(s.project.id)}
                    className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded border border-stone-200 dark:border-stone-700/60 hover:border-emerald-700/60 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-medium text-emerald-800 dark:text-emerald-400 truncate pr-2">
                        {s.project.type}
                      </span>
                      <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 shrink-0">
                        {s.similarityScore}% match
                      </span>
                    </div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 hover:underline">
                      {s.project.title}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      {s.project.departmentName} · {s.project.year}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
