type CompanyMentorStudent = {
  students: {
    uid: string;
    users: {
      name: string;
      email: string;
      contact: number | null;
    } | null;
    departments: {
      name: string;
    } | null;
    college_mentors: {
      users: {
        name: string;
      } | null;
    } | null;
    institutes: {
      name: string;
    } | null;
  } | null;
};

export default CompanyMentorStudent;
