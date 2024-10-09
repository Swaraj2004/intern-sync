type InternshipDetails = {
  role: string;
  field: string;
  mode: string;
  start_date: string;
  end_date: string;
  company_mentor_email: string;
  company_name: string;
  company_address: string;
  internship_letter_url: string;
  approved: boolean;
  college_mentor_uid: string;
  college_mentor_name: string;
  company_mentor_uid: string;
  company_mentor_name: string;
  company_mentor_designation: string;
  company_latitude: number;
  company_longitude: number;
  company_radius: number;
  student_uid: string;
  student_home_latitude: number;
  student_home_longitude: number;
  student_home_radius: number;
  student_name: string;
};

export default InternshipDetails;
