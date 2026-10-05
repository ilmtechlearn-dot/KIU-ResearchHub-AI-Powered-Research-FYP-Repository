import React from 'react';
import {
  ShieldAlert,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Award,
  ExternalLink,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Academic Platform Documentation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          About KIU ResearchHub
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          An AI-powered research and Final Year Project (FYP) discovery repository concept designed specifically for Karakoram International University (KIU), Gilgit-Baltistan, Pakistan.
        </p>
      </div>

      {/* Mandatory Independence Disclaimer */}
      <div className="p-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 rounded-xl space-y-2 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950 dark:text-amber-100">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Independent Academic Project Notice</span>
        </div>
        <p className="leading-relaxed">
          <strong>This platform is an independent academic/research project concept and is not an official KIU website unless formally authorized by KIU.</strong> All official university admissions, policies, regulations, and announcements are hosted exclusively on the verified Karakoram International University domain (
          <a
            href="https://www.kiu.edu.pk/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            https://www.kiu.edu.pk/
          </a>
          ).
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
          01. Motivation & Regional Objectives
        </h2>
        <p>
          Students and faculty across the mountainous districts of Gilgit-Baltistan (Gilgit, Hunza, Nagar, Skardu, Ghizer, Diamer, Astore, Ghanche, Shigar, Kharmang) generate substantial scholarly works addressing critical high-altitude challenges: glacial lake outburst floods (GLOFs), seismic vulnerability in vernacular architecture, indigenous languages like Shina and Burushaski, and alpine agriculture.
        </p>
        <p>
          Prior to this platform concept, capstone projects and research manuscripts remained dispersed across departmental filing cabinets or isolated hard drives. KIU ResearchHub provides:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>Centralized open repository for undergraduate and graduate capstones.</li>
          <li>Topic similarity analysis to prevent duplicate FYP submissions.</li>
          <li>Strictly grounded AI document question-answering with exact page and section citations.</li>
          <li>Direct integration with official KIU department and faculty registries.</li>
        </ul>
      </div>

      {/* AI Methodology & RAG System Architecture */}
      <div className="space-y-4 p-6 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
          <Sparkles className="w-4 h-4" />
          <h2 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
            02. RAG Pipeline & AI Citation Grounding
          </h2>
        </div>
        <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs">
          The platform integrates Retrieval-Augmented Generation (RAG) powered by Google Gemini (<code>gemini-3.8-flash</code>) executed strictly on the server-side to guarantee zero client exposure of API secrets.
        </p>
        <div className="p-3 bg-white dark:bg-stone-950 rounded border border-stone-200 dark:border-stone-800 font-mono text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed space-y-1">
          <div>Document Ingestion → Text Normalization → Semantic Chunking</div>
          <div>↓</div>
          <div>Candidate Retrieval (Cosine / Jaccard Matching on Department & Topic)</div>
          <div>↓</div>
          <div>Context Assembly (Excerpts with Page # and Section Title)</div>
          <div>↓</div>
          <div>Constrained LLM Synthesis with Grounded Citation Output</div>
        </div>
        <p className="text-stone-500 text-xs italic">
          Zero-Hallucination Guardrail: If an answer cannot be conclusively deduced from retrieved document excerpts, the assistant strictly returns: <em>"I couldn't find reliable information about this in the available KIU research sources."</em>
        </p>
      </div>

      {/* Verification & Data Policy */}
      <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
          03. Data Integrity & Verification Policy
        </h2>
        <p>
          The platform maintains four distinct classification statuses to eliminate misinformation:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
            <div className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official KIU Source</span>
            </div>
            <p className="text-stone-500">
              Verified documents directly sourced from the official <code>kiu.edu.pk</code> domain or faculty directory.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
            <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Research</span>
            </div>
            <p className="text-stone-500">
              Peer-reviewed capstone projects reviewed by departmental faculty supervisors.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
            <div className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1">
              <span>Pending Verification</span>
            </div>
            <p className="text-stone-500">
              New submissions held in the moderation pipeline awaiting administrator review.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
            <div className="font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5 mb-1">
              <span>Demo Record</span>
            </div>
            <p className="text-stone-500">
              Sample pedagogical records clearly marked to illustrate repository functionality without pretending to be official records.
            </p>
          </div>
        </div>
      </div>

      {/* HCI Principles & Design Philosophy */}
      <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
          04. Human-Computer Interaction (HCI) Design Principles
        </h2>
        <p>
          As an HCI-grounded Final Year Project, KIU ResearchHub adheres to core usability tenets:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
          <li><strong>Zero-Pill Discipline:</strong> Eliminates visual clutter by rendering static metadata as clean, unboxed text with typographic separators (<code>·</code>), reserving button containers strictly for clickable filter affordances.</li>
          <li><strong>Visibility of System Status:</strong> Continuous feedback with loading spinners, verification badges, and audit event logs.</li>
          <li><strong>Recognition Over Recall:</strong> Fast universal search (⌘K), suggested prompts in AI tools, and recent history tracks.</li>
          <li><strong>WCAG AA Compliance:</strong> Accessible contrast ratios, keyboard accessibility, and native dark mode.</li>
        </ul>
      </div>

      {/* Contact & Institutional Links */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-500">
        <div>
          Karakoram International University · University Road, Gilgit, Gilgit-Baltistan, Pakistan
        </div>
        <a
          href="https://www.kiu.edu.pk/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-semibold hover:underline"
        >
          <span>Visit KIU Official Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
