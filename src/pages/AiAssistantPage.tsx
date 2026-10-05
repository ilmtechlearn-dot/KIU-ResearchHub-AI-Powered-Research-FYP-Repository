import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Quote,
  Compass,
} from 'lucide-react';
import { AiChatMessage } from '../types';
import { api } from '../services/api';

interface AiAssistantPageProps {
  onViewResearch: (id: string) => void;
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  onViewResearch,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Welcome to the KIU AI Research Assistant.

I am configured to retrieve, analyze, and cite official and verified research from Karakoram International University (KIU), Gilgit-Baltistan.

How can I assist your scholarship today? You can inquire about mountain cryosphere studies, high-altitude agricultural computer vision, vernacular earthquake-resistant structures, or regional linguistic corpora.`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'What research has been done on mountain hazards in Hunza?',
        'Find FYPs using deep learning for agriculture',
        'Show me projects on isolated renewable microgrids',
        'Which departments work on environmental & climate research?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: AiChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await api.askAi({ question: query });

      const assistantMessage: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.answer,
        timestamp: 'Just now',
        citations: response.citations,
        suggestedFollowUps: [
          'What are the limitations of this approach?',
          'What future research directions were suggested?',
          'Find similar projects in the KIU repository',
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content:
            "I couldn't find reliable information about this in the available KIU research sources.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              KIU AI Research Assistant
            </h1>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/20">
              Grounded RAG
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Strict factual retrieval from verified Karakoram International University academic records.
          </p>
        </div>
      </div>

      {/* AI Transparency Banner */}
      <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-lg p-3 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <span className="leading-snug">
          <strong>Academic Transparency:</strong> Answers are retrieved exclusively from archived KIU research papers, theses, and capstone documents. AI answers must not be treated as official university statements or policy.
        </span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[92%] rounded-xl p-4 space-y-3 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 shadow-xs'
              }`}
            >
              {/* Message text */}
              <div className="whitespace-pre-line leading-relaxed font-sans">
                {msg.content}
              </div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
                  <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                    <Quote className="w-3 h-3" />
                    <span>Document Citations:</span>
                  </div>
                  {msg.citations.map((c, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-stone-600 dark:text-stone-400 pl-3 border-l-2 border-emerald-700"
                    >
                      <button
                        onClick={() => onViewResearch(c.researchId)}
                        className="font-semibold text-emerald-800 dark:text-emerald-400 hover:underline block text-left"
                      >
                        {c.researchTitle}
                        {c.pageNumber ? ` (Page ${c.pageNumber})` : ''}
                      </button>
                      <span className="italic text-[11px]">"{c.citationText.slice(0, 160)}..."</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block mb-1.5">
                    Suggested Inquiries:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((prompt, pi) => (
                      <button
                        key={pi}
                        onClick={() => handleSend(prompt)}
                        className="px-2.5 py-1 text-[11px] bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-stone-700 transition-all text-left cursor-pointer active:scale-95"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-stone-500 py-3">
            <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" />
            <span>Retrieving KIU repository documents & formulating cited response...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about KIU research, FYPs, mountain hazards, or departments..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-stone-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-emerald-800 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
