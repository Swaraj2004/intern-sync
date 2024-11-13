CREATE OR REPLACE FUNCTION get_internship_details(internship_id uuid) RETURNS TABLE(
        ROLE TEXT,
        field text,
        mode text,
        start_date date,
        end_date date,
        company_mentor_email text,
        company_name text,
        company_address text,
        internship_letter_url text,
        approved boolean,
        college_mentor_uid uuid,
        college_mentor_name text,
        company_mentor_uid uuid,
        company_mentor_name text,
        company_mentor_designation text,
        company_longitude double precision,
        company_latitude double precision,
        company_radius smallint,
        student_uid uuid,
        student_home_longitude double precision,
        student_home_latitude double precision,
        student_home_radius smallint,
        student_name text
    ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY
SELECT i.role,
    i.field,
    i.mode,
    i.start_date,
    i.end_date,
    i.company_mentor_email,
    i.company_name,
    i.company_address,
    i.internship_letter_url,
    i.approved,
    s.college_mentor_id AS college_mentor_uid,
    u_c.name AS college_mentor_name,
    i.company_mentor_id AS company_mentor_uid,
    u_cm.name AS company_mentor_name,
    cm.designation AS company_mentor_designation,
    cm.company_longitude AS company_longitude,
    cm.company_latitude AS company_latitude,
    cm.company_radius AS company_radius,
    s.uid AS student_uid,
    s.home_longitude AS student_home_longitude,
    s.home_latitude AS student_home_latitude,
    s.home_radius AS student_home_radius,
    u_s.name AS student_name
FROM internships i
    LEFT JOIN students s ON s.uid = i.student_id
    LEFT JOIN college_mentors cmu ON cmu.uid = s.college_mentor_id
    LEFT JOIN company_mentors cm ON cm.uid = i.company_mentor_id
    LEFT JOIN users u_c ON u_c.id = s.college_mentor_id
    LEFT JOIN users u_cm ON u_cm.id = i.company_mentor_id
    LEFT JOIN users u_s ON u_s.id = s.uid
WHERE i.id = internship_id
LIMIT 1;
END;
$$;