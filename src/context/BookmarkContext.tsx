import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'verification' | 'recommendation' | 'system';
  isRead: boolean;
  link?: string;
}

interface BookmarkContextType {
  bookmarks: string[];
  toggleBookmark: (researchId: string) => void;
  isBookmarked: (researchId: string) => boolean;
  recentlyViewed: string[];
  addToRecentlyViewed: (researchId: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadCount: number;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kiu_bookmarks');
      return saved ? JSON.parse(saved) : ['kiu-res-2026-001', 'kiu-res-2025-002'];
    } catch {
      return ['kiu-res-2026-001'];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kiu_recently_viewed');
      return saved ? JSON.parse(saved) : ['kiu-res-2026-001', 'kiu-res-2025-002', 'kiu-res-2025-005'];
    } catch {
      return ['kiu-res-2026-001'];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'FYP Project Verified',
      message: 'Your FYP "Deep Learning-Based Detection of Apricot Gummosis" was verified by Dr. Zafar Iqbal.',
      timestamp: '2 hours ago',
      type: 'verification',
      isRead: false,
      link: '/research/kiu-res-2026-001',
    },
    {
      id: 'notif-2',
      title: 'New Mountain Hazards Research Added',
      message: 'A new thesis on Shisper Glacier Surge modeling is now available in the repository.',
      timestamp: '1 day ago',
      type: 'recommendation',
      isRead: false,
      link: '/research/kiu-res-2025-002',
    },
  ]);

  useEffect(() => {
    localStorage.setItem('kiu_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('kiu_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const addToRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
        isBookmarked,
        recentlyViewed,
        addToRecentlyViewed,
        notifications,
        markNotificationAsRead,
        unreadCount,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within a BookmarkProvider');
  return context;
};
