export type AddInternshipParams = {
  id: string;
  role: string;
  field: string;
  mode: string;
  region: string;
  startDate: string;
  endDate: string;
  companyMentorEmail: string | null;
  companyName: string;
  companyAddress: string;
  internshipLetterUrl: string;
};

export type UpdateInternshipParams = {
  internshipId: string;
  role: string;
  field: string;
  mode: string;
  startDate: string;
  endDate: string;
  companyName: string;
  companyAddress: string;
  companyMentorEmail?: string;
  homeLatitude?: number;
  homeLongitude?: number;
  homeRadius?: number;
  companyLatitude?: number;
  companyLongitude?: number;
  companyRadius?: number;
};
