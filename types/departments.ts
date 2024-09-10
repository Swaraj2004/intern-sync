type Departments = {
  uid: string;
  name: string;
  users: {
    id: string;
    auth_id: string | null;
    name: string;
    email: string;
    is_registered: boolean;
    is_verified: boolean;
  } | null;
};

export default Departments;
