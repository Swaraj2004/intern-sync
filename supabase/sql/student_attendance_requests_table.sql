CREATE TABLE student_attendance_requests(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    date date NOT NULL,
    request_type text CHECK (request_type IN ('holiday', 'working_day')) NOT NULL,
    description text NOT NULL,
    approved boolean DEFAULT FALSE NOT NULL,
    student_id uuid NOT NULL,
    college_mentor_id uuid NOT NULL,
    internship_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::text),
    FOREIGN KEY (student_id) REFERENCES students(uid) ON DELETE CASCADE,
    FOREIGN KEY (college_mentor_id) REFERENCES college_mentors(uid) ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
);