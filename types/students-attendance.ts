type CollegeMentor = {
  uid: string;
  users: {
    id: string;
    name: string;
  } | null;
};

type Department = {
  uid: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  auth_id: string | null;
  is_verified: boolean;
  is_registered: boolean;
};

type Attendance = {
  id: string;
  status: string;
  date: string;
};

type StudentAttendance = {
  uid: string;
  attendance: Attendance[];
  college_mentors: CollegeMentor | null;
  departments: Department | null;
  users: User | null;
};

export default StudentAttendance;
