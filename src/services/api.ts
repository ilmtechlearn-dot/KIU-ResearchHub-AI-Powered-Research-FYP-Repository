import {
  ResearchItem,
  Department,
  Faculty,
  Researcher,
  AuditLog,
  VerificationStatus,
  SimilarProjectResult,
  FypTopicRecommendation,
} from '../types';

export const api = {
  async getDepartments(facultyId?: string): Promise<Department[]> {
    const query = facultyId ? `?facultyId=${encodeURIComponent(facultyId)}` : '';
    const res = await fetch(`/api/departments${query}`);
    const data = await res.json();
    return data.data || [];
  },

  async getFaculties(): Promise<Faculty[]> {
    const res = await fetch('/api/faculties');
    const data = await res.json();
    return data.data || [];
  },

  async getResearchers(departmentId?: string): Promise<Researcher[]> {
    const query = departmentId ? `?departmentId=${encodeURIComponent(departmentId)}` : '';
    const res = await fetch(`/api/researchers${query}`);
    const data = await res.json();
    return data.data || [];
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    const data = await res.json();
    return data.data || {};
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    const data = await res.json();
    return data.data || [];
  },

  async getResearch(params?: {
    type?: string;
    departmentId?: string;
    facultyId?: string;
    year?: number;
    search?: string;
    topic?: string;
    status?: string;
    isFeatured?: boolean;
    sort?: 'recent' | 'views' | 'citations' | 'year';
    limit?: number;
    offset?: number;
  }): Promise<{ items: ResearchItem[]; total: number }> {
    const sp = new URLSearchParams();
    if (params?.type) sp.set('type', params.type);
    if (params?.departmentId) sp.set('departmentId', params.departmentId);
    if (params?.facultyId) sp.set('facultyId', params.facultyId);
    if (params?.year) sp.set('year', params.year.toString());
    if (params?.search) sp.set('search', params.search);
    if (params?.topic) sp.set('topic', params.topic);
    if (params?.status) sp.set('status', params.status);
    if (params?.isFeatured !== undefined) sp.set('isFeatured', params.isFeatured.toString());
    if (params?.sort) sp.set('sort', params.sort);
    if (params?.limit) sp.set('limit', params.limit.toString());
    if (params?.offset) sp.set('offset', params.offset.toString());

    const res = await fetch(`/api/research?${sp.toString()}`);
    const data = await res.json();
    return { items: data.items || [], total: data.total || 0 };
  },

  async getResearchById(id: string): Promise<ResearchItem | null> {
    const res = await fetch(`/api/research/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  },

  async submitResearch(payload: any): Promise<ResearchItem> {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit research');
    return data.data;
  },

  async updateResearchStatus(
    id: string,
    status: VerificationStatus,
    adminName: string,
    rejectionReason?: string
  ): Promise<ResearchItem> {
    const res = await fetch(`/api/research/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminName, rejectionReason }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data.data;
  },

  async toggleFeatureResearch(id: string): Promise<ResearchItem> {
    const res = await fetch(`/api/research/${encodeURIComponent(id)}/feature`, {
      method: 'POST',
    });
    const data = await res.json();
    return data.data;
  },

  async recordView(id: string): Promise<void> {
    await fetch(`/api/research/${encodeURIComponent(id)}/view`, { method: 'POST' }).catch(() => {});
  },

  async recordDownload(id: string): Promise<void> {
    await fetch(`/api/research/${encodeURIComponent(id)}/download`, { method: 'POST' }).catch(() => {});
  },

  async getSimilarResearch(id: string, limit = 4): Promise<SimilarProjectResult[]> {
    const res = await fetch(`/api/research/${encodeURIComponent(id)}/similar?limit=${limit}`);
    const data = await res.json();
    return data.data || [];
  },

  async askAi(payload: {
    question: string;
    researchId?: string;
    departmentId?: string;
  }): Promise<{
    answer: string;
    citations: {
      researchId: string;
      researchTitle: string;
      pageNumber?: number;
      sectionTitle?: string;
      citationText: string;
    }[];
  }> {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return {
      answer: data.answer || "I couldn't find reliable information about this in the available KIU research sources.",
      citations: data.citations || [],
    };
  },

  async summarizeResearch(researchId: string): Promise<string> {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ researchId }),
    });
    const data = await res.json();
    return data.summary || '';
  },

  async recommendFypTopics(payload: {
    department: string;
    skills: string[];
    researchInterests: string[];
    preferredTechnology: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    problemArea: string;
  }): Promise<FypTopicRecommendation[]> {
    const res = await fetch('/api/fyp/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.recommendations || [];
  },
};
