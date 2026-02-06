
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  summary: string;
  url: string;
  contactEmail?: string; // New field for direct one-click email
  date?: string;
  matchScore: number;
  matchReasons: string[];
  fullDescription?: string;
  isApplied?: boolean;
}

export interface UserProfile {
  name: string;
  yearsOfExperience: number;
  primarySkills: string[];
  tools: string[];
  summary: string;
  domains: string[];
  email: string;
  resumeLink?: string;
}

export interface ApplicationHistory {
  id: string;
  jobId: string;
  company: string;
  title: string;
  appliedDate: string;
  emailContent: {
    subject: string;
    body: string;
  };
}

export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  FIND_JOBS = 'FIND_JOBS',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE'
}
