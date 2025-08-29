export interface JobApplication {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  workSetting: string[];
  dateApplied: string;
  status: string;
  stageReached: string;
  notes: string;
}