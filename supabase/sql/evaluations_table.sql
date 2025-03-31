CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date DATE NOT NULL,
    department_id UUID REFERENCES departments(uid) ON DELETE CASCADE,
    institute_id UUID REFERENCES institutes(uid) ON DELETE CASCADE
);
