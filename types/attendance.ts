type Attendance = {
  id: string;
  student_id: string;
  status: string | null;
  date: string;
  in_time: string | null;
  out_time: string | null;
  work_from_home: boolean;
};

export default Attendance;
