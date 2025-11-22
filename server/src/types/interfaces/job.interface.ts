export interface Job {
  _id?: string;
  jobUrl: string;
  title: string;
  company?: string;
  location?: string;
  category?: string;
  postedDate?: string;
  description?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}
