export type ApplicationFilters = {
  jobTitle?: string;
  company?: string;
  location?: string;
  jobType?: {
    fulltime: boolean;
    parttime: boolean;
  };
  workSetting?: {
    inperson: boolean;
    hybrid: boolean;
    remote: boolean;
  };
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  stagereached?: string;
};