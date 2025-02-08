CREATE OR REPLACE FUNCTION update_internship(
    requesting_user_id uuid,
    internship_id uuid,
    role text,
    field text,
    mode text,
    start_date date,
    end_date date,
    company_name text,
    company_address text,
    company_mentor_email text DEFAULT NULL,
    home_latitude double precision DEFAULT NULL,
    home_longitude double precision DEFAULT NULL,
    home_radius smallint DEFAULT NULL,
    company_latitude double precision DEFAULT NULL,
    company_longitude double precision DEFAULT NULL,
    company_radius smallint DEFAULT NULL
  ) RETURNS TABLE (
    student_id uuid,
    company_mentor_id uuid,
    updated boolean
  ) LANGUAGE plpgsql AS $$
DECLARE internship_record RECORD;
is_college_mentor boolean := false;
is_department_coordinator boolean := false;
BEGIN -- Step 1: Check if the internship exists
SELECT * INTO internship_record
FROM internships
WHERE id = update_internship.internship_id;
IF NOT FOUND THEN RAISE EXCEPTION 'Internship with id % not found.',
update_internship.internship_id;
END IF;
-- Step 2: Permission Check
SELECT EXISTS (
    SELECT 1
    FROM departments d
      JOIN users u ON u.id = d.uid
      JOIN user_roles ur ON ur.uid = u.id
      JOIN roles r ON ur.role_id = r.id
    WHERE u.id = update_internship.requesting_user_id
      AND r.name = 'department-coordinator'
      AND d.institute_id = internship_record.institute_id
      AND d.uid = internship_record.department_id
  ) INTO is_department_coordinator;
SELECT EXISTS (
    SELECT 1
    FROM college_mentors c
      JOIN users u ON u.id = c.uid
      JOIN user_roles ur ON ur.uid = u.id
      JOIN roles r ON ur.role_id = r.id
    WHERE u.id = update_internship.requesting_user_id
      AND r.name = 'college-mentor'
      AND c.institute_id = internship_record.institute_id
      AND c.uid = internship_record.college_mentor_id
  ) INTO is_college_mentor;
IF NOT is_college_mentor
AND NOT is_department_coordinator THEN RAISE EXCEPTION 'User % does not have permission to update this internship.',
update_internship.requesting_user_id;
END IF;
-- Step 3: Update the internship record
UPDATE internships
SET role = update_internship.role,
  field = update_internship.field,
  mode = update_internship.mode,
  start_date = update_internship.start_date,
  end_date = update_internship.end_date,
  company_mentor_email = update_internship.company_mentor_email,
  company_name = update_internship.company_name,
  company_address = update_internship.company_address
WHERE id = update_internship.internship_id;
-- Step 4: Update the student's home location
UPDATE students
SET home_latitude = update_internship.home_latitude,
  home_longitude = update_internship.home_longitude,
  home_radius = update_internship.home_radius
WHERE uid = internship_record.student_id;
-- Step 5: Update the company mentor's location (if assigned)
IF internship_record.company_mentor_id IS NOT NULL THEN
UPDATE company_mentors
SET company_latitude = update_internship.company_latitude,
  company_longitude = update_internship.company_longitude,
  company_radius = update_internship.company_radius
WHERE uid = internship_record.company_mentor_id;
END IF;
-- Step 6: Return the updated information
RETURN QUERY
SELECT internship_record.student_id,
  internship_record.company_mentor_id,
  true AS updated;
END;
$$;