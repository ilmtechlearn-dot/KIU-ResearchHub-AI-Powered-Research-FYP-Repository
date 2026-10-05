import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { AskAiModal } from './components/AskAiModal';

import { HomePage } from './pages/HomePage';
import { ResearchPage } from './pages/ResearchPage';
import { ResearchDetailPage } from './pages/ResearchDetailPage';
import { FypDiscoveryPage } from './pages/FypDiscoveryPage';
import { FypIdeaAssistantPage } from './pages/FypIdeaAssistantPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SubmitResearchPage } from './pages/SubmitResearchPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResearchersPage } from './pages/ResearchersPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { AboutPage } from './pages/AboutPage';
import { ResearchItem } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [pdfModalItem, setPdfModalItem] = useState<ResearchItem | null>(null);
  const [pdfInitialPage, setPdfInitialPage] = useState(1);
  const [askAiModalItem, setAskAiModalItem] = useState<ResearchItem | null>(null);

  // Simple URL hash synchronization for deep linking and browser back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        setCurrentPage('home');
        setPageParam(undefined);
        return;
      }

      if (hash.startsWith('research/')) {
        setCurrentPage('research-detail');
        setPageParam(hash.replace('research/', ''));
      } else if (hash.startsWith('research')) {
        setCurrentPage('research');
        const queryPart = hash.includes('?') ? hash.split('?')[1] : undefined;
        setPageParam(queryPart);
      } else if (hash.startsWith('fyp-advisor')) {
        setCurrentPage('fyp-advisor');
      } else if (hash.startsWith('fyp')) {
        setCurrentPage('fyp');
      } else if (hash.startsWith('ai-assistant')) {
        setCurrentPage('ai-assistant');
      } else if (hash.startsWith('submit')) {
        setCurrentPage('submit');
      } else if (hash.startsWith('dashboard')) {
        setCurrentPage('dashboard');
      } else if (hash.startsWith('admin')) {
        setCurrentPage('admin');
      } else if (hash.startsWith('analytics')) {
        setCurrentPage('analytics');
      } else if (hash.startsWith('researchers')) {
        setCurrentPage('researchers');
      } else if (hash.startsWith('departments')) {
        setCurrentPage('departments');
      } else if (hash.startsWith('about')) {
        setCurrentPage('about');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    setPageParam(param);

    // Update window hash
    if (page === 'home') {
      window.location.hash = '';
    } else if (page === 'research-detail' && param) {
      window.location.hash = `research/${param}`;
    } else if (page === 'research' && param) {
      window.location.hash = `research?${param}`;
    } else {
      window.location.hash = page;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPdf = (item: ResearchItem, page = 1) => {
    setPdfModalItem(item);
    setPdfInitialPage(page);
  };

  const handleAskAi = (item: ResearchItem) => {
    setAskAiModalItem(item);
  };

  // Helper to parse query parameters for research page
  const parseResearchQueryParams = () => {
    if (!pageParam) return {};
    const sp = new URLSearchParams(pageParam);
    return {
      search: sp.get('search') || '',
      department: sp.get('dept') || 'all',
      type: sp.get('type') || 'all',
      topic: sp.get('topic') || 'all',
    };
  };

  const researchFilters = parseResearchQueryParams();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-emerald-800 selection:text-white transition-colors">
      {/* Top Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onAskAi={handleAskAi}
            onOpenPdf={handleOpenPdf}
          />
        )}

        {currentPage === 'research' && (
          <ResearchPage
            initialSearch={researchFilters.search}
            initialDepartment={researchFilters.department}
            initialType={researchFilters.type}
            initialTopic={researchFilters.topic}
            onViewResearch={(id) => handleNavigate('research-detail', id)}
            onAskAi={handleAskAi}
          />
        )}

        {currentPage === 'research-detail' && pageParam && (
          <ResearchDetailPage
            id={pageParam}
            onOpenPdf={handleOpenPdf}
            onAskAi={handleAskAi}
            onViewOther={(id) => handleNavigate('research-detail', id)}
          />
        )}

        {currentPage === 'fyp' && (
          <FypDiscoveryPage
            onViewFyp={(id) => handleNavigate('research-detail', id)}
            onAskAi={handleAskAi}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'fyp-advisor' && (
          <FypIdeaAssistantPage
            onViewResearch={(id) => handleNavigate('research-detail', id)}
          />
        )}

        {currentPage === 'ai-assistant' && (
          <AiAssistantPage
            onViewResearch={(id) => handleNavigate('research-detail', id)}
          />
        )}

        {currentPage === 'submit' && (
          <SubmitResearchPage
            onSuccess={(id) => handleNavigate('research-detail', id)}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            onViewResearch={(id) => handleNavigate('research-detail', id)}
            onAskAi={handleAskAi}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage
            onViewResearch={(id) => handleNavigate('research-detail', id)}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage
            onViewResearch={(id) => handleNavigate('research-detail', id)}
          />
        )}

        {currentPage === 'researchers' && (
          <ResearchersPage
            onViewDepartment={(deptId) => handleNavigate('research', `dept=${deptId}`)}
          />
        )}

        {currentPage === 'departments' && (
          <DepartmentsPage
            onSelectDepartment={(deptId) => handleNavigate('research', `dept=${deptId}`)}
          />
        )}

        {currentPage === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* PDF Reader Modal */}
      <PdfViewerModal
        isOpen={!!pdfModalItem}
        research={pdfModalItem}
        initialPage={pdfInitialPage}
        onClose={() => setPdfModalItem(null)}
      />

      {/* "Ask AI About This Research" Modal */}
      <AskAiModal
        isOpen={!!askAiModalItem}
        research={askAiModalItem}
        onClose={() => setAskAiModalItem(null)}
        onJumpToPage={(p) => {
          if (askAiModalItem) {
            handleOpenPdf(askAiModalItem, p);
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BookmarkProvider>
            <AppContent />
          </BookmarkProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
