import { supabaseClient } from '@/utils/supabase/client';
import { useQuery } from '@supabase-cache-helpers/postgrest-swr';

const supabase = supabaseClient();

export const useDepartments = ({ instituteId }: { instituteId: number }) => {
  const shouldFetch = Boolean(instituteId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('departments')
          .select(
            'uid, name, users (id, auth_id, name, email, is_registered, is_verified)'
          )
          .eq('institute_id', instituteId)
          .order('created_at', { ascending: false })
      : null
  );

  return {
    data,
    ...rest,
  };
};

export const useCollegeMentors = ({
  instituteId,
  departmentId,
}: {
  instituteId: number;
  departmentId?: string;
}) => {
  const shouldFetch = Boolean(instituteId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? (() => {
          let query = supabase
            .from('college_mentors')
            .select(
              'uid, departments (uid, name), users (id, auth_id, name, email, is_registered, is_verified)'
            )
            .eq('institute_id', instituteId)
            .order('created_at', { ascending: false });

          if (departmentId) {
            query = query.eq('department_id', departmentId);
          }

          return query;
        })()
      : null
  );

  return {
    data,
    ...rest,
  };
};

export const useStudents = ({
  instituteId,
  departmentId,
  collegeMentorId,
}: {
  instituteId: number;
  departmentId?: string;
  collegeMentorId?: string;
}) => {
  const shouldFetch = Boolean(instituteId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? (() => {
          let query = supabase
            .from('students')
            .select(
              'uid, college_mentors (uid, users (id, name)), departments (uid, name), users (id, auth_id, name, email, is_registered, is_verified)'
            )
            .eq('institute_id', instituteId)
            .order('created_at', { ascending: false });

          if (departmentId) {
            query = query.eq('department_id', departmentId);
          }

          if (collegeMentorId) {
            query = query.eq('college_mentor_id', collegeMentorId);
          }

          return query;
        })()
      : null
  );

  return {
    data,
    ...rest,
  };
};

export const useAttendanceWithStudents = ({
  instituteId,
  departmentId,
  collegeMentorId,
  attendanceDate,
}: {
  instituteId: number;
  departmentId?: string;
  collegeMentorId?: string;
  attendanceDate: string;
}) => {
  const shouldFetch = Boolean(instituteId && attendanceDate);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? (() => {
          let query = supabase
            .from('students')
            .select(
              'uid, college_mentors (uid, users (id, name)), departments (uid, name), users (id, auth_id, name, email, is_registered, is_verified), internships (id, role, start_date, end_date), attendance (id, status, date, in_time, out_time, work_from_home)'
            )
            .eq('institute_id', instituteId)
            .eq('attendance.date', attendanceDate)
            .order('created_at', { ascending: false });

          if (departmentId) {
            query = query.eq('department_id', departmentId);
          }

          if (collegeMentorId) {
            query = query.eq('college_mentor_id', collegeMentorId);
          }

          return query;
        })()
      : null
  );

  return {
    data,
    ...rest,
  };
};

export const useReportsWithStudents = ({
  instituteId,
  departmentId,
  collegeMentorId,
  reportDate,
}: {
  instituteId: number;
  departmentId?: string;
  collegeMentorId?: string;
  reportDate: string;
}) => {
  const shouldFetch = Boolean(instituteId && reportDate);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? (() => {
          let query = supabase
            .from('students')
            .select(
              'uid, college_mentors (uid, users (name)), users (name), internships (id, start_date, end_date), attendance (id, status, date, in_time, out_time, work_from_home, internship_reports (division, details, main_points, feedback, status))'
            )
            .eq('institute_id', instituteId)
            .eq('attendance.date', reportDate)
            .order('created_at', { ascending: false });

          if (departmentId) {
            query = query.eq('department_id', departmentId);
          }

          if (collegeMentorId) {
            query = query.eq('college_mentor_id', collegeMentorId);
          }

          return query;
        })()
      : null
  );

  return {
    data,
    ...rest,
  };
};

export const useInstituteProfile = ({ userId }: { userId: string }) => {
  const shouldFetch = Boolean(userId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('institutes')
          .select(
            'uid, name, address, institute_email_domain, student_email_domain, users (name, email, contact)'
          )
          .eq('uid', userId)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    ...rest,
  };
};

export const useDepartmentProfile = ({ userId }: { userId: string }) => {
  const shouldFetch = Boolean(userId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('departments')
          .select('uid, name, users (name, email, contact), institutes (name)')
          .eq('uid', userId)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    ...rest,
  };
};

export const useCollegeMentorProfile = ({ userId }: { userId: string }) => {
  const shouldFetch = Boolean(userId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('college_mentors')
          .select(
            'uid, users (name, email, contact), departments (name), institutes (name)'
          )
          .eq('uid', userId)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    ...rest,
  };
};

export const useStudentProfile = ({ userId }: { userId: string }) => {
  const shouldFetch = Boolean(userId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('students')
          .select(
            'uid, dob, address, admission_year, division, roll_no, admission_id, users (name, email, contact), departments (name), college_mentors (users (name)), institutes (name)'
          )
          .eq('uid', userId)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    ...rest,
  };
};

export const useCompanyMentorProfile = ({ userId }: { userId: string }) => {
  const shouldFetch = Boolean(userId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('company_mentors')
          .select(
            'uid, designation, company_name, company_address, users (name, email, contact)'
          )
          .eq('uid', userId)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    ...rest,
  };
};

export const useStudentInternships = ({ studentId }: { studentId: string }) => {
  const shouldFetch = Boolean(studentId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('internships')
          .select(
            'id, role, field, mode, region, start_date, end_date, company_mentor_email, company_name, company_address, internship_letter_url, approved'
          )
          .eq('student_id', studentId)
      : null
  );

  return {
    data,
    ...rest,
  };
};

export const useInternshipAttendance = ({
  internshipId,
  attendanceDate,
}: {
  internshipId?: string;
  attendanceDate: string;
}) => {
  const shouldFetch = Boolean(internshipId && attendanceDate);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('attendance')
          .select(
            'id, student_id, status, date, in_time, out_time, work_from_home'
          )
          .eq('internship_id', internshipId!)
          .eq('date', attendanceDate)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    ...rest,
  };
};

export const useDailyReport = ({
  attendanceId,
  reportDate,
}: {
  attendanceId?: string;
  reportDate: string;
}) => {
  const shouldFetch = Boolean(attendanceId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('attendance')
          .select('date, internship_reports (division, details, main_points)')
          .eq('id', attendanceId!)
          .eq('date', reportDate)
          .single()
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    ...rest,
  };
};

export const useInternships = ({
  collegeMentorId,
}: {
  collegeMentorId: string;
}) => {
  const shouldFetch = Boolean(collegeMentorId);

  const { data, ...rest } = useQuery(
    shouldFetch
      ? supabase
          .from('internships')
          .select(
            'id, role, field, mode, region, start_date, end_date, company_mentor_email, company_name, company_address, internship_letter_url, approved, students (uid, users (name))'
          )
          .eq('college_mentor_id', collegeMentorId)
      : null
  );

  return {
    data,
    ...rest,
  };
};
