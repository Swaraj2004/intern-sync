type CompanyMentorProfile = {
  uid: string;
  designation: string | null;
  company_name: string | null;
  company_address: string | null;
  company_latitude: number | null;
  company_longitude: number | null;
  company_radius: number | null;
  users: {
    name: string;
    email: string;
    contact: number | null;
  } | null;
};

export default CompanyMentorProfile;
