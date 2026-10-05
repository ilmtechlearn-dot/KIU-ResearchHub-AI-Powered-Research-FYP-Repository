import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Layers,
  BookOpen,
} from 'lucide-react';
import { FypTopicRecommendation, Department } from '../types';
import { api } from '../services/api';
import { OFFICIAL_KIU_DEPARTMENTS } from '../data/kiuData';

interface FypIdeaAssistantPageProps {
  onViewResearch: (id: string) => void;
}

export const FypIdeaAssistantPage: React.FC<FypIdeaAssistantPageProps> = ({
  onViewResearch,
}) => {
  const [selectedDept, setSelectedDept] = useState(
    'Department of Computer Science'
  );
  const [skills, setSkills] = useState('Python, Deep Learning, OpenCV');
  const [interests, setInterests] = useState(
    'Mountain Hazards, Agriculture, Computer Vision'
  );
  const [tech, setTech] = useState('PyTorch & Edge Computing');
  const [difficulty, setDifficulty] = useState<
    'Beginner' | 'Intermediate' | 'Advanced'
  >('Intermediate');
  const [problemArea, setProblemArea] = useState(
    'Real-time landslide detection and agricultural pest alerts along the Karakoram corridor'
  );

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<
    FypTopicRecommendation[]
  >([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recs = await api.recommendFypTopics({
        department: selectedDept,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        researchInterests: interests.split(',').map((s) => s.trim()).filter(Boolean),
        preferredTechnology: tech,
        difficulty,
        problemArea,
      });
      setRecommendations(recs);
    } catch (err) {
      console.error('Error getting recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Introduction */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          <GraduationCap className="w-4 h-4" />
          <span>Undergraduate Capstone Advisory</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          Find Your FYP Topic — AI Advisory Engine
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
          Input your department, current technical proficiencies, and problem interests. The system scans verified KIU repository projects to identify potential research gaps and generates tailored, high-rigor capstone project proposals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Student Profile */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <Lightbulb className="w-4 h-4 text-emerald-700" />
            <h2 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
              Your Academic Profile & Interests
            </h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            {/* Department */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-800 dark:text-stone-200"
              >
                {OFFICIAL_KIU_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Technical Skills */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Current Technical Skills
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, Flutter, C++, GIS, PyTorch"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Comma-separated tools or programming languages you are comfortable with.
              </span>
            </div>

            {/* Research Interests */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Research Areas of Interest
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Glaciology, NLP, Clean Energy, Agriculture"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            {/* Preferred Technology / Model */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Preferred Technology / Methodology
              </label>
              <input
                type="text"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                placeholder="e.g. Convolutional Neural Networks, IoT LoRaWAN, Blockchain"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            {/* Target Difficulty */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Target Project Scope & Complexity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                  <button
                    type="button"
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 text-center rounded border transition-all cursor-pointer active:scale-95 ${
                      difficulty === diff
                        ? 'bg-emerald-800 text-white border-emerald-800 font-semibold shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Area Description */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Specific Regional Problem or Hypothesis
              </label>
              <textarea
                rows={3}
                value={problemArea}
                onChange={(e) => setProblemArea(e.target.value)}
                placeholder="Describe the regional challenge in Gilgit-Baltistan you wish to address..."
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-md font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing KIU Repositories & Finding Gaps...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommend FYP Topics</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {recommendations.length === 0 && !loading && (
            <div className="p-8 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-center space-y-3">
              <Lightbulb className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Ready to Generate Grounded FYP Proposals
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                Click <strong>"Recommend FYP Topics"</strong> to generate structured capstone blueprints. Each proposal includes problem formulation, regional gap analysis, target users, and relevant KIU reference literature.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                Scanning KIU Capstone Archive & Cross-Referencing Topics
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Comparing your criteria against existing research in {selectedDept} to identify novel research opportunities.
              </p>
            </div>
          )}

          {recommendations.map((rec, index) => (
            <div
              key={rec.id || index}
              className="p-6 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
            >
              {/* Header with Difficulty & Number */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <span className="text-xs font-serif font-bold text-emerald-800 dark:text-emerald-400">
                  Proposal #{index + 1}
                </span>
                <span className="text-[11px] font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                  Difficulty: {rec.difficulty}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {rec.title}
              </h3>

              {/* Problem & Solution */}
              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-stone-900 dark:text-stone-200">
                    Regional Problem:
                  </strong>{' '}
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {rec.problem}
                  </span>
                </div>
                <div>
                  <strong className="text-stone-900 dark:text-stone-200">
                    Proposed Solution:
                  </strong>{' '}
                  <span className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {rec.proposedSolution}
                  </span>
                </div>
              </div>

              {/* Research Gap (Strict wording mandated by prompt) */}
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border-l-2 border-emerald-700 text-xs text-stone-700 dark:text-stone-300">
                <div className="font-semibold text-emerald-900 dark:text-emerald-300 mb-0.5">
                  Identified Research Opportunity:
                </div>
                <div className="italic">{rec.researchGap}</div>
              </div>

              {/* Tech Stack & Expected Users */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] block mb-1">
                    Technology Stack
                  </span>
                  <div className="font-mono text-stone-700 dark:text-stone-300">
                    {rec.technologyStack.join(' · ')}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] block mb-1">
                    Expected Beneficiaries
                  </span>
                  <div className="text-stone-600 dark:text-stone-400">
                    {rec.expectedUsers}
                  </div>
                </div>
              </div>

              {/* Suggested Dataset */}
              {rec.suggestedDataset && (
                <div className="text-xs pt-1">
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] block mb-1">
                    Potential Regional Dataset
                  </span>
                  <div className="text-stone-600 dark:text-stone-400">
                    {rec.suggestedDataset}
                  </div>
                </div>
              )}

              {/* Related KIU Research */}
              {rec.relatedKiuResearch && rec.relatedKiuResearch.length > 0 && (
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] block mb-1.5">
                    Precedent Research in Repository:
                  </span>
                  <div className="space-y-1">
                    {rec.relatedKiuResearch.map((r, ri) => (
                      <div
                        key={ri}
                        onClick={() => onViewResearch(r.id)}
                        className="flex items-center justify-between text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-400 cursor-pointer p-1.5 rounded hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                      >
                        <span className="truncate pr-2">{r.title}</span>
                        <span className="font-mono text-stone-400 shrink-0 text-[11px]">
                          {r.similarity} overlap
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
