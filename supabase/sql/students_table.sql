CREATE TABLE students(
  uid uuid PRIMARY KEY,
  dob date,
  address text,
  admission_year smallint,
  academic_year smallint NOT NULL,
  division char(1),
  roll_no text,
  admission_id text,
  home_longitude double precision,
  home_latitude double precision,
  home_radius smallint,
  college_mentor_id uuid,
  department_id uuid NOT NULL,
  institute_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::text),
  FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (college_mentor_id) REFERENCES college_mentors(uid),
  FOREIGN KEY (department_id) REFERENCES departments(uid),
  FOREIGN KEY (institute_id) REFERENCES institutes(uid)
);