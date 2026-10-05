import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  Upload,
  UserCheck,
  Moon,
  Sun,
  Menu,
  X,
  Bell,
  ExternalLink,
  ChevronDown,
  Check,
  GraduationCap,
  Layers,
  BarChart3,
  Building,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenSearch: () => void;
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, currentPage, onNavigate }) => {
  const { user, switchUser } = useAuth();
  const { unreadCount, notifications, markNotificationAsRead } = useBookmarks();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRoleDropdownOpen(false);
        setNotifDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
    showToast(
      isDark ? 'Switched to Light Theme' : 'Switched to Dark Theme',
      'Theme preference saved automatically',
      'info'
    );
  };

  const handleRoleChange = (newRole: UserRole, roleTitle: string) => {
    switchUser(newRole);
    setRoleDropdownOpen(false);
    showToast(`Active View: ${roleTitle}`, `Viewing repository as ${newRole}`, 'info');
  };

  const navLinks = [
    { id: 'research', label: 'Explore Research', icon: BookOpen },
    { id: 'fyp', label: 'FYP Portal', icon: GraduationCap },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, isSpecial: true },
    { id: 'researchers', label: 'Researchers', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'student', title: 'Student', desc: 'Browse FYPs, submit, save papers' },
    { role: 'researcher', title: 'Researcher', desc: 'Publications, citations, analysis' },
    { role: 'faculty', title: 'Faculty / Supervisor', desc: 'Supervised FYPs, verify work' },
    { role: 'admin', title: 'Administrator', desc: 'Verification queue, full control' },
    { role: 'public', title: 'Public Visitor', desc: 'Open discovery & citations' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-200">
      {/* Official KIU source notice banner */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 flex items-center justify-between border-b border-emerald-900/50">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <span className="truncate">
            Independent Research Discovery Platform for <strong>Karakoram International University (KIU)</strong>
          </span>
        </div>
        <a
          href="https://www.kiu.edu.pk/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors shrink-0 ml-3 font-medium active:scale-95"
        >
          <span>Official kiu.edu.pk</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Single text element wordmark with active tap feedback */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="text-left flex items-center gap-2.5 sm:gap-3 shrink-0 group focus:outline-none cursor-pointer active:scale-98 transition-transform"
        >
          <div className="w-9 h-9 rounded-md bg-emerald-800 text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs border border-emerald-700/60 group-hover:bg-emerald-700 transition-colors">
            K
          </div>
          <div>
            <div className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-none group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
              KIU ResearchHub
            </div>
            <div className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 tracking-wide font-medium">
              Academic & FYP Repository
            </div>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors py-1 relative flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                currentPage === link.id
                  ? 'text-emerald-800 dark:text-emerald-400 font-semibold'
                  : ''
              }`}
            >
              {link.isSpecial && <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              <span>{link.label}</span>
              {currentPage === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 dark:bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors py-1 cursor-pointer active:scale-95 ${
                currentPage === 'admin'
                  ? 'text-emerald-800 dark:text-emerald-400 font-semibold'
                  : ''
              }`}
            >
              Admin Panel
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Universal Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search repository (Press Cmd+K or Ctrl+K)"
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md border border-stone-200 dark:border-stone-700 transition-all cursor-pointer active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Dedicated Theme Toggle Button (Desktop & Tablet) */}
          <button
            onClick={handleThemeToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-all cursor-pointer active:scale-90"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700 animate-fade-in" />
            )}
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              aria-label="View notifications"
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-all cursor-pointer relative active:scale-90"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full"></span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 text-xs animate-slide-up">
                <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800 font-semibold text-stone-900 dark:text-white flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-stone-400 font-normal">{notifications.length} events</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) onNavigate('research-detail', n.link.split('/').pop());
                        setNotifDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer transition-colors"
                    >
                      <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                        <span>{n.title}</span>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        )}
                      </div>
                      <div className="text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">
                        {n.message}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setNotifDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md border border-stone-200 dark:border-stone-700 transition-all cursor-pointer active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline capitalize">{user.role}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-slide-up">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleChange(r.role, r.title)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-start justify-between cursor-pointer ${
                      user.role === r.role
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                        : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div>
                      <div>{r.title}</div>
                      <div className="text-[10px] text-stone-400 font-normal">{r.desc}</div>
                    </div>
                    {user.role === r.role && (
                      <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
                <div className="border-t border-stone-100 dark:border-stone-800 mt-1 pt-1 px-3">
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left py-1 text-xs text-emerald-800 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                  >
                    Open User Dashboard →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Research Action Button (Desktop) */}
          <button
            onClick={() => onNavigate('submit')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-md shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit Research</span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden p-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer active:scale-90"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Content */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[105px] bg-stone-950/60 backdrop-blur-xs z-30 lg:hidden animate-fade-in"
          />

          {/* Drawer Menu */}
          <div className="lg:hidden relative z-40 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-slide-up">
            {/* Nav Links */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                  currentPage === 'home'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                Home
              </button>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                      currentPage === link.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>{link.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  onNavigate('fyp-advisor');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                  currentPage === 'fyp-advisor'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Find Your FYP Topic (AI)</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                    currentPage === 'admin'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <UserCheck className="w-4 h-4 text-stone-500" />
                <span>My Dashboard ({user.role})</span>
              </button>
            </div>

            {/* Mobile Actions: Submit & Mobile Theme Toggle */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
              <button
                onClick={() => {
                  onNavigate('submit');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-98"
              >
                <Upload className="w-4 h-4" />
                <span>Submit Research Document</span>
              </button>

              {/* Mobile Dedicated Theme Switcher Bar */}
              <button
                onClick={handleThemeToggle}
                className="w-full py-2.5 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-sm font-medium flex items-center justify-between transition-colors active:scale-98"
              >
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-stone-700" />
                  )}
                  <span>Appearance: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                <span className="text-xs text-stone-400 font-normal">Tap to switch</span>
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
