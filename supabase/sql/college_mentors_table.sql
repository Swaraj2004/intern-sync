CREATE TABLE college_mentors (
    uid UUID PRIMARY KEY,
    institute_id UUID NOT NULL,
    department_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::TEXT),
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (institute_id) REFERENCES institutes(uid),
    FOREIGN KEY (department_id) REFERENCES departments(uid)
);