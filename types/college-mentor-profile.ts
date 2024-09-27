type CollegeMentorProfile = {
  uid: string;
  users: {
    name: string;
    email: string;
    contact: number | null;
  } | null;
  departments: {
    name: string;
  } | null;
  institutes: {
    name: string;
  } | null;
};

export default CollegeMentorProfile;
