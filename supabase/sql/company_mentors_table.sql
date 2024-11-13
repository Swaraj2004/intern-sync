CREATE TABLE company_mentors (
    uid UUID PRIMARY KEY,
    designation TEXT,
    company_name TEXT,
    company_address TEXT,
    company_longitude DOUBLE PRECISION,
    company_latitude DOUBLE PRECISION,
    company_radius SMALLINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::TEXT),
    FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE
);