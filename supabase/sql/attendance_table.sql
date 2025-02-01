CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    work_from_home BOOLEAN DEFAULT FALSE NOT NULL,
    status TEXT CHECK (
        status IN ('present', 'absent', 'holiday', 'pending')
    ),
    in_time TIME,
    out_time TIME,
    internship_id UUID NOT NULL,
    student_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::TEXT),
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(uid) ON DELETE CASCADE,
    CONSTRAINT daily_unique_attendance UNIQUE (student_id, date)
);