type CollegeMentor = {
  uid: string;
  users: {
    name: string;
  } | null;
};

type User = {
  name: string;
};

export type InternshipReport = {
  division: string;
  details: string;
  main_points: string;
  status: string;
  feedback: string | null;
};

type Attendance = {
  id: string;
  status: string | null;
  date: string;
  in_time: string | null;
  out_time: string | null;
  work_from_home: boolean;
  internship_reports: InternshipReport | null;
};

type Internship = {
  id: string;
  start_date: string;
  end_date: string;
};

type StudentReport = {
  uid: string;
  attendance: Attendance[];
  internships: Internship[];
  college_mentors: CollegeMentor | null;
  users: User | null;
};

export default StudentReport;
