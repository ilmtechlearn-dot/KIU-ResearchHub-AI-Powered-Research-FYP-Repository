import type {
  ResearchItem,
  Faculty,
  Department,
  Researcher,
  AuditLog,
  VerificationStatus,
  SimilarProjectResult,
} from '../types/index.ts';
import {
  OFFICIAL_KIU_FACULTIES,
  OFFICIAL_KIU_DEPARTMENTS,
  OFFICIAL_KIU_RESEARCHERS,
  INITIAL_RESEARCH_DATABASE,
} from '../data/kiuData.ts';

class ResearchHubDatabase {
  private research: ResearchItem[] = [];
  private faculties: Faculty[] = [];
  private departments: Department[] = [];
  private researchers: Researcher[] = [];
  private auditLogs: AuditLog[] = [];
  private bookmarks: { userId: string; researchId: string; createdAt: string }[] = [];

  constructor() {
    this.faculties = [...OFFICIAL_KIU_FACULTIES];
    this.departments = [...OFFICIAL_KIU_DEPARTMENTS];
    this.researchers = [...OFFICIAL_KIU_RESEARCHERS];
    this.research = [...INITIAL_RESEARCH_DATABASE];

    // Seed initial audit logs
    this.auditLogs = [
      {
        id: 'log-001',
        timestamp: '2026-02-20T11:15:00Z',
        userId: 'admin-01',
        userName: 'KIU ASR Admin',
        action: 'VERIFIED_RESEARCH',
        targetId: 'kiu-res-2026-001',
        targetTitle: 'Deep Learning-Based Detection of Apricot Gummosis and Blight in Gilgit Valley Orchards',
        details: 'Approved FYP submission following supervisor recommendation by Dr. Zafar Iqbal.',
      },
      {
        id: 'log-002',
        timestamp: '2026-01-25T11:00:00Z',
        userId: 'admin-01',
        userName: 'KIU ASR Admin',
        action: 'VERIFIED_RESEARCH',
        targetId: 'kiu-res-2026-008',
        targetTitle: 'Hydrological Modeling of the Hunza River Basin Under Projected CMIP6 Climate Warming Scenarios',
        details: 'Verified doctoral dissertation submission from Department of Environmental Sciences.',
      },
    ];
  }

  public getAllResearch(params?: {
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
  }): { items: ResearchItem[]; total: number } {
    let result = [...this.research];

    if (params?.type && params.type !== 'all') {
      result = result.filter((item) => item.type.toLowerCase() === params.type!.toLowerCase());
    }

    if (params?.departmentId && params.departmentId !== 'all') {
      result = result.filter((item) => item.departmentId === params.departmentId);
    }

    if (params?.facultyId && params.facultyId !== 'all') {
      result = result.filter((item) => item.facultyId === params.facultyId);
    }

    if (params?.year && !isNaN(params.year)) {
      result = result.filter((item) => item.year === params.year);
    }

    if (params?.status && params.status !== 'all') {
      result = result.filter((item) => item.verificationStatus === params.status);
    }

    if (params?.isFeatured !== undefined) {
      result = result.filter((item) => item.isFeatured === params.isFeatured);
    }

    if (params?.topic && params.topic !== 'all') {
      const topicLower = params.topic.toLowerCase();
      result = result.filter(
        (item) =>
          item.researchArea.toLowerCase().includes(topicLower) ||
          item.keywords.some((k) => k.toLowerCase().includes(topicLower))
      );
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.abstract.toLowerCase().includes(q) ||
          item.authors.some((a) => a.toLowerCase().includes(q)) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)) ||
          (item.supervisorName && item.supervisorName.toLowerCase().includes(q)) ||
          item.departmentName.toLowerCase().includes(q) ||
          item.technologies.some((t) => t.toLowerCase().includes(q)) ||
          item.researchArea.toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    switch (params?.sort) {
      case 'views':
        result.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case 'citations':
        result.sort((a, b) => b.citationCount - a.citationCount);
        break;
      case 'year':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'recent':
      default:
        result.sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        break;
    }

    const total = result.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 100;
    const paginated = result.slice(offset, offset + limit);

    return { items: paginated, total };
  }

  public getResearchById(idOrSlug: string): ResearchItem | undefined {
    return this.research.find(
      (item) => item.id === idOrSlug || item.slug === idOrSlug
    );
  }

  public createResearch(
    data: Omit<ResearchItem, 'id' | 'slug' | 'viewsCount' | 'downloadsCount' | 'bookmarksCount' | 'citationCount' | 'submittedAt' | 'verificationStatus' | 'isDemoData'> & {
      submittedBy: string;
      sourceType?: 'Student Submitted' | 'Faculty Submitted' | 'Official KIU';
    }
  ): ResearchItem {
    const nextNum = this.research.length + 1;
    const id = `kiu-sub-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`;
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newItem: ResearchItem = {
      ...data,
      id,
      slug,
      viewsCount: 0,
      downloadsCount: 0,
      bookmarksCount: 0,
      citationCount: 0,
      verificationStatus: 'Pending Verification',
      sourceType: data.sourceType || 'Student Submitted',
      isDemoData: false,
      submittedAt: new Date().toISOString(),
      fullDocumentChunks: data.fullDocumentChunks && data.fullDocumentChunks.length > 0 ? data.fullDocumentChunks : [
        {
          pageNumber: 1,
          sectionTitle: 'Abstract and Project Scope',
          content: data.abstract,
        },
        {
          pageNumber: 2,
          sectionTitle: 'Methodology & Technologies',
          content: `${data.methodology}. Developed using technologies: ${data.technologies.join(', ')}.`,
        },
        {
          pageNumber: 3,
          sectionTitle: 'Results, Findings and Limitations',
          content: `Results: ${data.resultsSummary}. Limitations: ${data.limitations}. Future Work: ${data.futureWork}.`,
        }
      ]
    };

    this.research.unshift(newItem);

    // Audit log
    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: data.submittedBy,
      userName: data.authors[0] || 'Contributor',
      action: 'SUBMIT_RESEARCH',
      targetId: id,
      targetTitle: newItem.title,
      details: `New research project uploaded into verification queue under ${newItem.departmentName}.`,
    });

    return newItem;
  }

  public updateResearchStatus(
    id: string,
    newStatus: VerificationStatus,
    adminName: string,
    rejectionReason?: string
  ): ResearchItem | null {
    const item = this.research.find((r) => r.id === id);
    if (!item) return null;

    item.verificationStatus = newStatus;
    if (newStatus === 'Verified Research' || newStatus === 'Official KIU Source') {
      item.verifiedAt = new Date().toISOString();
      item.verifiedBy = adminName;
      item.rejectionReason = undefined;
    } else if (newStatus === 'Rejected') {
      item.rejectionReason = rejectionReason || 'Does not meet academic verification criteria.';
    }

    this.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'admin',
      userName: adminName,
      action: `STATUS_CHANGE_TO_${newStatus.toUpperCase().replace(/\s+/g, '_')}`,
      targetId: id,
      targetTitle: item.title,
      details: `Status set to ${newStatus}${rejectionReason ? `: ${rejectionReason}` : ''}`,
    });

    return item;
  }

  public toggleFeature(id: string): ResearchItem | null {
    const item = this.research.find((r) => r.id === id);
    if (!item) return null;
    item.isFeatured = !item.isFeatured;
    return item;
  }

  public incrementViews(id: string): void {
    const item = this.research.find((r) => r.id === id);
    if (item) item.viewsCount += 1;
  }

  public incrementDownloads(id: string): void {
    const item = this.research.find((r) => r.id === id);
    if (item) item.downloadsCount += 1;
  }

  public getSimilarResearch(targetId: string, limit = 4): SimilarProjectResult[] {
    const target = this.research.find((r) => r.id === targetId);
    if (!target) return [];

    const targetWords = new Set(
      `${target.title} ${target.abstract} ${target.keywords.join(' ')}`
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

    const candidates = this.research.filter((r) => r.id !== targetId);

    const scored = candidates.map((cand) => {
      const candWords = new Set(
        `${cand.title} ${cand.abstract} ${cand.keywords.join(' ')}`
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .split(/\s+/)
          .filter((w) => w.length > 3)
      );

      let commonCount = 0;
      targetWords.forEach((word) => {
        if (candWords.has(word)) commonCount++;
      });

      const jaccard = commonCount / Math.max(1, targetWords.size + candWords.size - commonCount);
      let score = Math.round(jaccard * 100);

      // Boost if in same department or research area
      if (cand.departmentId === target.departmentId) score += 20;
      if (cand.researchArea === target.researchArea) score += 15;

      const techOverlap = cand.technologies.filter((t) =>
        target.technologies.some((tt) => tt.toLowerCase() === t.toLowerCase())
      );
      if (techOverlap.length > 0) score += 10;

      // Bound between 35 and 95 for realistic academic display
      score = Math.min(95, Math.max(35, score));

      const matchingReasons: string[] = [];
      if (cand.departmentId === target.departmentId) {
        matchingReasons.push(`Shares academic department: ${cand.departmentName}`);
      }
      if (techOverlap.length > 0) {
        matchingReasons.push(`Overlapping technology: ${techOverlap.join(', ')}`);
      }
      if (cand.researchArea === target.researchArea) {
        matchingReasons.push(`Congruent research area: ${cand.researchArea}`);
      }

      return {
        project: cand,
        similarityScore: score,
        matchingReasons: matchingReasons.length > 0 ? matchingReasons : ['Related conceptual themes in repository'],
        overlapArea: cand.researchArea,
      };
    });

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  }

  public getAnalytics() {
    const totalResearch = this.research.length;
    const totalFyps = this.research.filter((r) => r.type === 'FYP').length;
    const totalTheses = this.research.filter((r) => r.type === 'Thesis').length;
    const totalPublications = this.research.filter(
      (r) => r.type === 'Publication' || r.type === 'Research Paper' || r.type === 'Conference Paper'
    ).length;
    const totalDepartments = this.departments.length;
    const totalResearchers = this.researchers.length;
    const pendingVerifications = this.research.filter(
      (r) => r.verificationStatus === 'Pending Verification'
    ).length;

    // Research by Year
    const yearMap: Record<number, number> = {};
    this.research.forEach((r) => {
      yearMap[r.year] = (yearMap[r.year] || 0) + 1;
    });
    const researchByYear = Object.keys(yearMap)
      .map((y) => ({ year: parseInt(y, 10), count: yearMap[parseInt(y, 10)] }))
      .sort((a, b) => a.year - b.year);

    // Research by Department
    const deptMap: Record<string, { name: string; count: number }> = {};
    this.research.forEach((r) => {
      if (!deptMap[r.departmentId]) {
        deptMap[r.departmentId] = { name: r.departmentName, count: 0 };
      }
      deptMap[r.departmentId].count += 1;
    });
    const researchByDepartment = Object.values(deptMap).sort((a, b) => b.count - a.count);

    // Research by Type
    const typeMap: Record<string, number> = {};
    this.research.forEach((r) => {
      typeMap[r.type] = (typeMap[r.type] || 0) + 1;
    });
    const researchByType = Object.keys(typeMap).map((type) => ({
      type,
      count: typeMap[type],
    }));

    // Most Viewed & Most Downloaded
    const mostViewed = [...this.research]
      .sort((a, b) => b.viewsCount - a.viewsCount)
      .slice(0, 5)
      .map((r) => ({ id: r.id, title: r.title, viewsCount: r.viewsCount, type: r.type, department: r.departmentName }));

    const mostDownloaded = [...this.research]
      .sort((a, b) => b.downloadsCount - a.downloadsCount)
      .slice(0, 5)
      .map((r) => ({ id: r.id, title: r.title, downloadsCount: r.downloadsCount, type: r.type }));

    return {
      totalResearch,
      totalFyps,
      totalTheses,
      totalPublications,
      totalDepartments,
      totalResearchers,
      pendingVerifications,
      researchByYear,
      researchByDepartment,
      researchByType,
      mostViewed,
      mostDownloaded,
    };
  }

  public getFaculties(): Faculty[] {
    return this.faculties;
  }

  public getDepartments(facultyId?: string): Department[] {
    if (facultyId && facultyId !== 'all') {
      return this.departments.filter((d) => d.facultyId === facultyId);
    }
    return this.departments;
  }

  public getResearchers(departmentId?: string): Researcher[] {
    if (departmentId && departmentId !== 'all') {
      return this.researchers.filter((r) => r.departmentId === departmentId);
    }
    return this.researchers;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }
}

export const db = new ResearchHubDatabase();
