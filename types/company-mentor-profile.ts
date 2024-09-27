type CompanyMentorProfile = {
  uid: string;
  designation: string | null;
  company_name: string | null;
  company_address: string | null;
  users: {
    name: string;
    email: string;
    contact: number | null;
  } | null;
};

export default CompanyMentorProfile;
