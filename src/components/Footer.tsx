import React from 'react';
import { ExternalLink, ShieldAlert, University, MapPin, Globe } from 'lucide-react';
import { OFFICIAL_KIU_RESOURCES, OFFICIAL_KIU_CAMPUSES } from '../data/kiuData';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 transition-colors">
      {/* Institutional Disclaimer Bar */}
      <div className="bg-stone-950 border-b border-stone-800 py-3.5 px-4 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Institutional Disclaimer:</strong> KIU ResearchHub is an independent academic and final year research discovery system concept designed for Karakoram International University (KIU), Gilgit-Baltistan. This platform is not an official university website unless formally authorized by KIU. All official academic policies, admissions, and institutional directives reside exclusively on official KIU domains (
            <a
              href="https://www.kiu.edu.pk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline hover:text-emerald-300"
            >
              kiu.edu.pk
            </a>
            ). AI-generated summaries are automated study aids and must never be cited as official university statements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Platform Overview */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center font-serif font-bold text-sm">
                K
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                KIU ResearchHub
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              AI-powered research discovery and Final Year Project (FYP) repository for Karakoram International University, Gilgit-Baltistan, Pakistan. Connecting scholars, supervisors, and students.
            </p>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <University className="w-3.5 h-3.5 text-emerald-500" />
                <span>Karakoram International University</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Gilgit-Baltistan, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <a
                  href="https://www.kiu.edu.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  www.kiu.edu.pk
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Repository Navigation */}
          <div>
            <div className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Repository Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('research')}
                  className="hover:text-white transition-colors"
                >
                  Browse Research Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fyp')}
                  className="hover:text-white transition-colors"
                >
                  FYP & Thesis Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fyp-advisor')}
                  className="hover:text-white transition-colors text-emerald-400"
                >
                  Find Your FYP Topic (AI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-assistant')}
                  className="hover:text-white transition-colors"
                >
                  AI Research Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('researchers')}
                  className="hover:text-white transition-colors"
                >
                  Verified Faculty Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('departments')}
                  className="hover:text-white transition-colors"
                >
                  Academic Departments
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submit')}
                  className="hover:text-white transition-colors"
                >
                  Submit Research Document
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-stone-400"
                >
                  About Platform & Methodology
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official KIU Portals (External) */}
          <div>
            <div className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Official KIU Portals
            </div>
            <ul className="space-y-2 text-xs">
              {OFFICIAL_KIU_RESOURCES.slice(0, 6).map((res) => (
                <li key={res.url}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-stone-300 hover:text-emerald-400 transition-colors group"
                  >
                    <span className="truncate">{res.name}</span>
                    <ExternalLink className="w-3 h-3 text-stone-500 group-hover:text-emerald-400 shrink-0 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: KIU Campuses */}
          <div>
            <div className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              KIU Campuses
            </div>
            <ul className="space-y-3 text-xs">
              {OFFICIAL_KIU_CAMPUSES.map((camp) => (
                <li key={camp.name} className="border-l border-emerald-800/80 pl-2.5">
                  <div className="font-medium text-stone-200">{camp.name}</div>
                  <div className="text-[11px] text-stone-500">{camp.location}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} KIU ResearchHub. Independent academic research repository concept.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => onNavigate('about')} className="hover:text-stone-300">
              Methodology & Privacy
            </button>
            <span>·</span>
            <a
              href="https://www.kiu.edu.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-300"
            >
              Karakoram International University
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
