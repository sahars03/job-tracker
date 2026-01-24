export type ApplicationFilters = {
  jobTitle?: string;
  company?: string;
  workSetting?: {
    inperson: boolean;
    hybrid: boolean;
    remote: boolean;
  };
  dateFrom?: string;
  dateTo?: string;
};

/** in the future, add
 * - location
 * - job type
 * - status
 * - stage reached
 */
