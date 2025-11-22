export interface Job {
  jobUrl: string;
  title: string;
  company?: string;
  location?: string;
  category?: string;
  postedDate?: Date;
  description?: string;
  source?: string;
}
