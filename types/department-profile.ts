type DepartmentProfile = {
  uid: string;
  name: string;
  users: {
    name: string;
    email: string;
    contact: number | null;
  } | null;
  institutes: {
    name: string;
  } | null;
};

export default DepartmentProfile;
