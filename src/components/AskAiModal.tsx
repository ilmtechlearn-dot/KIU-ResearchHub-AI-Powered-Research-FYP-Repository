import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  BookOpen,
  AlertCircle,
  Quote,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ResearchItem } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface AskAiModalProps {
  research: ResearchItem | null;
  isOpen: boolean;
  onClose: () => void;
  onJumpToPage?: (page: number) => void;
}

export const AskAiModal: React.FC<AskAiModalProps> = ({
  research,
  isOpen,
  onClose,
  onJumpToPage,
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { showToast } = useToast();

  const [history, setHistory] = useState<
    {
      q: string;
      a: string;
      citations: {
        pageNumber?: number;
        sectionTitle?: string;
        citationText: string;
      }[];
    }[]
  >([]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !research) return null;

  const quickQuestions = [
    'What dataset was used in this research?',
    'What specific methodology was deployed?',
    'What were the primary quantitative results?',
    'What regional limitations exist in Gilgit-Baltistan?',
    'What future work directions did authors recommend?',
    'Explain this research project in simple terms.',
  ];

  const handleSend = async (qToSend?: string) => {
    const query = qToSend || question;
    if (!query.trim() || loading) return;

    setLoading(true);
    if (!qToSend) setQuestion('');

    try {
      const response = await api.askAi({
        question: query,
        researchId: research.id,
      });

      setHistory((prev) => [
        ...prev,
        {
          q: query,
          a: response.answer,
          citations: response.citations || [],
        },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          q: query,
          a: "I couldn't find reliable information about this in the available KIU research sources.",
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnswer = (answerText: string, index: number) => {
    navigator.clipboard.writeText(answerText);
    setCopiedIndex(index);
    showToast('Copied to Clipboard', 'AI response and citations copied', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden animate-slide-up"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 bg-stone-50 dark:bg-stone-950/50">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate">
                  Ask AI About This Research
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded shrink-0">
                  Grounded Citations
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                {research.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                aria-label="Clear chat history"
                title="Clear conversation"
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md transition-colors active:scale-90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content & History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* Transparency Disclaimer */}
          <div className="p-3 bg-stone-50 dark:bg-stone-950/60 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>AI Transparency Notice:</strong> Answers are retrieved strictly from uploaded KIU document text chunks with verified page and section citations.
            </span>
          </div>

          {/* Initial state with quick questions */}
          {history.length === 0 && (
            <div className="py-2 sm:py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                Suggested Academic Inquiries
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="p-2.5 text-left text-xs bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-900 dark:hover:text-emerald-200 rounded-lg border border-stone-200 dark:border-stone-800 transition-all cursor-pointer active:scale-98"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation history */}
          {history.map((turn, i) => (
            <div key={i} className="space-y-2 animate-slide-up">
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 p-3 rounded-lg text-xs sm:text-sm shadow-xs">
                  {turn.q}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[95%] bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-800/20 dark:border-emerald-700/20 p-3.5 rounded-lg text-xs sm:text-sm text-stone-800 dark:text-stone-200 space-y-2.5 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="whitespace-pre-line leading-relaxed flex-1 font-sans">
                      {turn.a}
                    </div>
                    <button
                      onClick={() => handleCopyAnswer(turn.a, i)}
                      aria-label="Copy answer"
                      title="Copy response"
                      className="p-1 text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 shrink-0 transition-colors cursor-pointer active:scale-90"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {turn.citations.length > 0 && (
                    <div className="pt-2 border-t border-emerald-800/10 dark:border-emerald-700/20 space-y-1">
                      <div className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                        <Quote className="w-3 h-3" />
                        <span>Source Citations:</span>
                      </div>
                      {turn.citations.map((c, idx) => (
                        <div
                          key={idx}
                          className="text-[11px] text-stone-600 dark:text-stone-400 pl-3 border-l-2 border-emerald-600"
                        >
                          <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                            Page {c.pageNumber || '1'} — {c.sectionTitle || 'Document'}
                          </span>
                          : <span className="italic">"{c.citationText.slice(0, 140)}..."</span>
                          {onJumpToPage && c.pageNumber && (
                            <button
                              onClick={() => {
                                onJumpToPage(c.pageNumber!);
                                onClose();
                              }}
                              className="ml-2 text-emerald-700 dark:text-emerald-400 underline hover:font-bold cursor-pointer"
                            >
                              Jump to Page
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-stone-500 py-3 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Retrieving document chunks & grounding answer with citations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this research..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2 bg-emerald-800 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
