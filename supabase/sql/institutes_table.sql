CREATE TABLE institutes (
    uid UUID PRIMARY KEY,
    aicte_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    address TEXT,
    institute_email_domain TEXT,
    student_email_domain TEXT,
    internship_approval_format_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::TEXT),
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE
);