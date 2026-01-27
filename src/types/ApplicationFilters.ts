export type ApplicationFilters = {
  jobTitle?: string;
  company?: string;
  location?: string;
  jobType?: "full-time" | "part-time" | null;
  workSetting?: {
    inperson: boolean;
    hybrid: boolean;
    remote: boolean;
  };
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
  stagereached?: string;
};