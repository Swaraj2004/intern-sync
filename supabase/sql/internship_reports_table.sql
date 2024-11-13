CREATE TABLE internship_reports (
    id UUID PRIMARY KEY,
    division TEXT NOT NULL,
    details TEXT NOT NULL,
    main_points TEXT NOT NULL,
    status TEXT CHECK (status IN ('approved', 'revision', 'pending')) NOT NULL,
    feedback TEXT,
    student_id UUID NOT NULL,
    internship_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::TEXT),
    FOREIGN KEY (id) REFERENCES attendance(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(uid),
    FOREIGN KEY (internship_id) REFERENCES internships(id)
);