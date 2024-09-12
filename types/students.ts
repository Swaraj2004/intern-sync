type Students = {
  uid: string;
  college_mentors: {
    uid: string;
    users: {
      id: string;
      name: string;
    } | null;
  } | null;
  departments: {
    uid: string;
    name: string;
  } | null;
  users: {
    id: string;
    auth_id: string | null;
    name: string;
    email: string;
    is_registered: boolean;
    is_verified: boolean;
  } | null;
};

export default Students;
