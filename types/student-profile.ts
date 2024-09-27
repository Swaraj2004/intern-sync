type StudentProfile = {
  uid: string;
  address: string | null;
  admission_year: number | null;
  division: string | null;
  roll_no: number | null;
  admission_id: string | null;
  users: {
    name: string;
    email: string;
    contact: number | null;
  } | null;
  college_mentors: {
    users: {
      name: string;
    } | null;
  } | null;
  departments: {
    name: string;
  } | null;
  institutes: {
    name: string;
  } | null;
};

export default StudentProfile;
