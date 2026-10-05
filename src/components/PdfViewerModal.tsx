import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Search,
  Sparkles,
  BookOpen,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { ResearchItem } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface PdfViewerModalProps {
  research: ResearchItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  research,
  isOpen,
  onClose,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [sidebarQuestion, setSidebarQuestion] = useState('');
  const [sidebarAnswer, setSidebarAnswer] = useState<{
    text: string;
    citations: any[];
  } | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && research) {
        const total = Math.max(1, research.fullDocumentChunks.length);
        setCurrentPage((p) => Math.min(total, p + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, research, onClose]);

  if (!isOpen || !research) return null;

  const totalPages = Math.max(1, research.fullDocumentChunks.length);
  const currentChunk =
    research.fullDocumentChunks.find((c) => c.pageNumber === currentPage) ||
    research.fullDocumentChunks[0] || {
      pageNumber: 1,
      sectionTitle: 'Document Content',
      content: research.abstract,
    };

  const handleDownload = () => {
    api.recordDownload(research.id);
    showToast('Downloading Manuscript', `Saved "${research.slug}.txt" locally`, 'success');
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
          research.fullDocumentChunks
            .map((c) => `--- PAGE ${c.pageNumber}: ${c.sectionTitle} ---\n${c.content}`)
            .join('\n\n') +
          `\n\nOfficial Source: ${research.sourceUrl}\nVerified by: ${research.verifiedBy || 'KIU ResearchHub'}`
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${research.slug}-kiu-research.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAskSidebar = async (q?: string) => {
    const query = q || sidebarQuestion;
    if (!query.trim() || sidebarLoading) return;

    setSidebarLoading(true);
    try {
      const res = await api.askAi({
        question: query,
        researchId: research.id,
      });
      setSidebarAnswer({
        text: res.answer,
        citations: res.citations || [],
      });
    } catch {
      setSidebarAnswer({
        text: "I couldn't find reliable information about this in the available KIU research sources.",
        citations: [],
      });
    } finally {
      setSidebarLoading(false);
    }
  };

  // Highlight search occurrences inside document text
  const renderHighlightedContent = (text: string) => {
    if (!searchTerm.trim()) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/40 text-stone-900 dark:text-white px-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md transition-all ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-stone-100 dark:bg-stone-950 rounded-lg shadow-2xl border border-stone-300 dark:border-stone-800 flex flex-col overflow-hidden transition-all ${
          isFullscreen ? 'h-screen w-screen rounded-none' : 'max-w-6xl h-[92vh]'
        }`}
      >
        {/* PDF Reader Toolbar */}
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Document metadata info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded bg-emerald-800 text-white flex items-center justify-center font-serif text-xs font-bold shrink-0">
              PDF
            </div>
            <div className="truncate">
              <span className="font-semibold text-stone-900 dark:text-white truncate block max-w-[180px] sm:max-w-sm md:max-w-md">
                {research.title}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                KIU Repository · {research.departmentName} ({research.year})
              </span>
            </div>
          </div>

          {/* Navigation & Zoom Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Page Jumper */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded px-1.5 py-1 text-xs">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                aria-label="Previous page (Left arrow)"
                className="p-1 hover:text-emerald-700 disabled:opacity-30 cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 sm:px-2 font-mono tabular-nums text-stone-700 dark:text-stone-300 text-xs">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                aria-label="Next page (Right arrow)"
                className="p-1 hover:text-emerald-700 disabled:opacity-30 cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* In-doc search */}
            <div className="hidden sm:flex items-center bg-stone-100 dark:bg-stone-800 rounded px-2 py-1">
              <Search className="w-3 h-3 text-stone-400 mr-1.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find in text..."
                className="w-20 md:w-28 bg-transparent text-xs focus:outline-none text-stone-800 dark:text-stone-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear in-document search"
                  className="text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="hidden md:flex items-center bg-stone-100 dark:bg-stone-800 rounded px-1 py-1">
              <button
                onClick={() => setZoom((z) => Math.max(75, z - 15))}
                aria-label="Zoom out"
                className="p-1 text-stone-600 dark:text-stone-300 hover:text-emerald-700 cursor-pointer active:scale-90"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 font-mono text-[11px] text-stone-600 dark:text-stone-400">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 15))}
                aria-label="Zoom in"
                className="p-1 text-stone-600 dark:text-stone-300 hover:text-emerald-700 cursor-pointer active:scale-90"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle AI Sidebar */}
            <button
              onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer active:scale-95 ${
                aiSidebarOpen
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              aria-label="Download Document"
              title="Download manuscript"
              className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer active:scale-90"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="hidden sm:inline-block p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer active:scale-90"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close PDF Viewer"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-all cursor-pointer active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Workspace (Document Sheet + Optional AI Sidebar) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Document Scroll Canvas */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center bg-stone-200/70 dark:bg-stone-950/80">
            {/* Simulated Academic Paper Sheet */}
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-sm shadow-xl border border-stone-300 dark:border-stone-800 p-6 sm:p-10 md:p-12 transition-transform duration-150 min-h-[700px] flex flex-col justify-between"
            >
              {/* Institutional Header */}
              <div>
                <div className="border-b-2 border-emerald-900/60 pb-4 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] sm:text-[11px] uppercase tracking-widest font-serif font-bold text-emerald-900 dark:text-emerald-400">
                      Karakoram International University · Gilgit-Baltistan
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {research.facultyName} · {research.departmentName}
                    </div>
                  </div>
                  <div className="sm:text-right text-[11px] text-stone-400">
                    <div>Document Ref: {research.id}</div>
                    <div>Cohort Year: {research.year}</div>
                  </div>
                </div>

                {/* Paper Title on Page 1 */}
                {currentPage === 1 && (
                  <div className="mb-6 text-center">
                    <h1 className="font-serif text-lg sm:text-2xl font-bold leading-tight text-stone-900 dark:text-white max-w-2xl mx-auto">
                      {research.title}
                    </h1>
                    <div className="text-xs text-stone-600 dark:text-stone-300 mt-2 font-medium">
                      {research.authors.join(' · ')}
                    </div>
                    {research.supervisorName && (
                      <div className="text-xs text-stone-500 italic mt-0.5">
                        Research Supervisor: {research.supervisorName}
                      </div>
                    )}
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{research.verificationStatus}</span>
                    </div>
                  </div>
                )}

                {/* Section Title */}
                <div className="flex items-center gap-2 mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-400">
                    § {currentPage}.0
                  </span>
                  <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                    {currentChunk.sectionTitle}
                  </h2>
                </div>

                {/* Section Body */}
                <div className="font-serif text-sm leading-relaxed text-stone-800 dark:text-stone-200 space-y-4 text-justify">
                  <p className="first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2">
                    {renderHighlightedContent(currentChunk.content)}
                  </p>
                </div>

                {/* Page 1 Abstract Metadata Box */}
                {currentPage === 1 && (
                  <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded text-xs space-y-2">
                    <div>
                      <strong className="text-stone-800 dark:text-stone-200">Keywords:</strong>{' '}
                      <span className="text-stone-600 dark:text-stone-400">
                        {research.keywords.join(', ')}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-800 dark:text-stone-200">Technologies:</strong>{' '}
                      <span className="font-mono text-stone-600 dark:text-stone-400">
                        {research.technologies.join(', ')}
                      </span>
                    </div>
                    {research.datasetName && (
                      <div>
                        <strong className="text-stone-800 dark:text-stone-200">Dataset:</strong>{' '}
                        <span className="text-stone-600 dark:text-stone-400">
                          {research.datasetName}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Document Sheet Footer with Page Jump controls */}
              <div className="pt-6 mt-10 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                <span>KIU ResearchHub Digital Library</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="hover:underline disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="font-mono">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="hover:underline disabled:opacity-30 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Ask AI Sidebar */}
          {aiSidebarOpen && (
            <div className="absolute inset-0 sm:relative sm:w-80 lg:w-96 z-20 sm:z-auto bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 flex flex-col h-full animate-slide-in shadow-xl sm:shadow-none">
              <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950/50">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI While Reading</span>
                </div>
                <button
                  onClick={() => setAiSidebarOpen(false)}
                  aria-label="Close AI Sidebar"
                  className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded border border-emerald-800/20 text-stone-700 dark:text-stone-300 leading-snug">
                  Ask questions about Page {currentPage} or the whole project. Responses are grounded directly in this paper.
                </div>

                {/* Quick questions for current page */}
                <div className="space-y-1">
                  <button
                    onClick={() => handleAskSidebar('What are the key takeaways of this section?')}
                    className="w-full text-left p-2 rounded bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-300 transition-colors text-[11px] cursor-pointer"
                  >
                    "Summarize Section § {currentPage}.0"
                  </button>
                  <button
                    onClick={() => handleAskSidebar('What dataset or empirical evidence was referenced?')}
                    className="w-full text-left p-2 rounded bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-300 transition-colors text-[11px] cursor-pointer"
                  >
                    "What empirical data is cited here?"
                  </button>
                </div>

                {sidebarLoading && (
                  <div className="flex items-center gap-2 py-3 text-stone-500 animate-pulse">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>Analyzing document text...</span>
                  </div>
                )}

                {sidebarAnswer && (
                  <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded border border-stone-200 dark:border-stone-800 space-y-2 animate-slide-up">
                    <div className="text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed font-sans">
                      {sidebarAnswer.text}
                    </div>
                    {sidebarAnswer.citations.length > 0 && (
                      <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold">
                        Grounded in Page {sidebarAnswer.citations[0].pageNumber} ({sidebarAnswer.citations[0].sectionTitle})
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Input */}
              <div className="p-2.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskSidebar();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={sidebarQuestion}
                    onChange={(e) => setSidebarQuestion(e.target.value)}
                    placeholder="Ask about this paper..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none text-stone-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={sidebarLoading || !sidebarQuestion.trim()}
                    className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer active:scale-95"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
