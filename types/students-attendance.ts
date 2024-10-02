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
  status: string | null;
  date: string;
  in_time: string | null;
  out_time: string | null;
  work_from_home: boolean;
};

type Internship = {
  id: string;
  role: string;
  start_date: string;
  end_date: string;
};

type StudentAttendance = {
  uid: string;
  attendance: Attendance[];
  internships: Internship[];
  college_mentors: CollegeMentor | null;
  departments: Department | null;
  users: User | null;
};

export default StudentAttendance;
