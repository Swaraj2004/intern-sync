type InstituteProfile = {
  uid: string;
  name: string;
  address: string | null;
  institute_email_domain: string | null;
  student_email_domain: string | null;
  users: {
    name: string;
    email: string;
    contact: number | null;
  } | null;
};

export default InstituteProfile;
