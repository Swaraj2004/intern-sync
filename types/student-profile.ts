type StudentProfile = {
  uid: string;
  dob: string | null;
  address: string | null;
  admission_year: number | null;
  division: string | null;
  roll_no: string | null;
  admission_id: string | null;
  home_latitude: number | null;
  home_longitude: number | null;
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
