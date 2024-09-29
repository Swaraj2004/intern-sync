type StudentInternship = {
  id: string;
  role: string;
  field: string;
  mode: string;
  start_date: string;
  end_date: string;
  company_mentor_email: string | null;
  company_name: string;
  company_address: string;
  internship_letter_url: string;
  approved: boolean;
};

export default StudentInternship;
