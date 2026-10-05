export type ResearchType =
  | 'FYP'
  | 'Thesis'
  | 'Research Paper'
  | 'Publication'
  | 'Project'
  | 'Dataset'
  | 'Conference Paper'
  | 'Other';

export type VerificationStatus =
  | 'Official KIU Source'
  | 'Verified Research'
  | 'Faculty Submitted'
  | 'Student Submitted'
  | 'Pending Verification'
  | 'Rejected';

export type UserRole =
  | 'student'
  | 'researcher'
  | 'faculty'
  | 'admin'
  | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  studentId?: string;
  avatar?: string;
  designation?: string;
}

export interface Faculty {
  id: string;
  name: string;
  slug: string;
  officialUrl: string;
  description: string;
  deanName?: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  facultyId: string;
  facultyName: string;
  officialUrl: string;
  description: string;
  headName?: string;
  researchFocus: string[];
}

export interface DocumentPageChunk {
  pageNumber: number;
  sectionTitle: string;
  content: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  slug: string;
  type: ResearchType;
  abstract: string;
  authors: string[];
  departmentId: string;
  departmentName: string;
  facultyId: string;
  facultyName: string;
  supervisorName?: string;
  year: number;
  keywords: string[];
  researchArea: string;
  methodology: string;
  technologies: string[];
  datasetName?: string;
  datasetDescription?: string;
  resultsSummary: string;
  limitations: string;
  futureWork: string;
  documentUrl?: string;
  sourceUrl: string;
  sourceType: 'Official KIU' | 'Faculty Submitted' | 'Student Submitted' | 'Demo Data';
  verificationStatus: VerificationStatus;
  isDemoData: boolean;
  isFeatured?: boolean;
  viewsCount: number;
  downloadsCount: number;
  bookmarksCount: number;
  citationCount: number;
  submittedBy?: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  aiSummary?: string;
  fullDocumentChunks: DocumentPageChunk[];
}

export interface Researcher {
  id: string;
  name: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  facultyName: string;
  email: string;
  researchInterests: string[];
  officialProfileUrl: string;
  publicationsCount: number;
  supervisedCount: number;
  bio: string;
}

export interface ResearchTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  relatedDepartments: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  targetId: string;
  targetTitle: string;
  details: string;
}

export interface SimilarProjectResult {
  project: ResearchItem;
  similarityScore: number; // percentage, e.g. 88
  matchingReasons: string[];
  overlapArea: string;
}

export interface FypTopicRecommendation {
  id: string;
  title: string;
  problem: string;
  proposedSolution: string;
  technologyStack: string[];
  expectedUsers: string;
  researchGap: string; // "Potential research opportunity based on available repository records."
  suggestedDataset: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  department: string;
  relatedKiuResearch: {
    id: string;
    title: string;
    similarity: string;
  }[];
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: {
    researchId: string;
    researchTitle: string;
    pageNumber?: number;
    sectionTitle?: string;
    citationText: string;
    url?: string;
  }[];
  suggestedFollowUps?: string[];
}
