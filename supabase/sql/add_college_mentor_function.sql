CREATE OR REPLACE FUNCTION add_college_mentor(
        mentor_name text,
        email text,
        institute_id uuid,
        department_id uuid,
        requesting_user_id uuid
    ) RETURNS TABLE (
        user_id uuid,
        auth_id uuid,
        is_new_user boolean,
        has_role boolean,
        is_verified boolean
    ) LANGUAGE plpgsql AS $$
DECLARE existing_user RECORD;
existing_role RECORD;
new_user boolean := false;
has_role boolean := false;
is_verified boolean := false;
college_mentor_role_id uuid;
is_institute_coordinator boolean := false;
is_department_coordinator boolean := false;
institute_admin_domain text;
email_domain text;
BEGIN -- Step 1: Fetch the 'college-mentor' role ID from the roles table
SELECT id INTO college_mentor_role_id
FROM roles
WHERE name = 'college-mentor';
IF NOT FOUND THEN RAISE EXCEPTION 'College mentor role not found.';
END IF;
-- Step 2: Check if the requesting user is an 'institute-coordinator'
SELECT EXISTS (
        SELECT 1
        FROM institutes i
            JOIN users u ON u.id = i.uid
            JOIN user_roles ur ON ur.uid = u.id
            JOIN roles r ON ur.role_id = r.id
        WHERE u.id = requesting_user_id
            AND r.name = 'institute-coordinator'
            AND i.uid = add_college_mentor.institute_id
    ) INTO is_institute_coordinator;
-- Step 3: Check if the requesting user is a 'department-coordinator'
SELECT EXISTS (
        SELECT 1
        FROM departments d
            JOIN users u ON u.id = d.uid
            JOIN user_roles ur ON ur.uid = u.id
            JOIN roles r ON ur.role_id = r.id
        WHERE u.id = requesting_user_id
            AND r.name = 'department-coordinator'
            AND d.institute_id = add_college_mentor.institute_id
            AND d.uid = add_college_mentor.department_id
    ) INTO is_department_coordinator;
-- Step 4: Raise an error if the user does not have the correct permissions
IF NOT is_institute_coordinator
AND NOT is_department_coordinator THEN RAISE EXCEPTION 'User does not have permission to add college mentor.';
END IF;
--changes
-- Fetch the domain for the specified institute and compare with email domain
SELECT institute_email_domain INTO institute_admin_domain
FROM institutes
WHERE uid = add_college_mentor.institute_id;
IF NOT FOUND THEN RAISE EXCEPTION 'Institute not found.';
END IF;
--check if the institute domain is null
IF institute_admin_domain IS NULL THEN RAISE EXCEPTION 'Please complete profile before adding coordinator';
END IF;
-- Extract the domain from the email
email_domain := split_part(email, '@', 2);
IF email_domain != institute_admin_domain THEN RAISE EXCEPTION 'Email domain does not match the institute student domain.';
END IF;
--end of changes
-- Step 5: Check if the user already exists by email
SELECT * INTO existing_user
FROM users
WHERE users.email = add_college_mentor.email;
-- Step 6: If user does not exist, insert the user
IF NOT FOUND THEN
INSERT INTO users (name, email)
VALUES (mentor_name, add_college_mentor.email)
RETURNING * INTO existing_user;
-- Set new_user flag to true as we inserted a new user
new_user := true;
-- Insert into college_mentors table
INSERT INTO college_mentors (uid, institute_id, department_id)
VALUES (
        existing_user.id,
        add_college_mentor.institute_id,
        add_college_mentor.department_id
    );
-- Assign the dynamically fetched college-mentor role to the user
INSERT INTO user_roles (uid, role_id)
VALUES (existing_user.id, college_mentor_role_id);
ELSE is_verified := existing_user.is_verified;
-- Step 7: Check if the user already has the college-mentor role
SELECT * INTO existing_role
FROM user_roles
WHERE uid = existing_user.id
    AND user_roles.role_id = college_mentor_role_id;
IF FOUND THEN -- User already has the college-mentor role
has_role := true;
RAISE EXCEPTION 'User is already a college mentor.';
ELSE -- Assign the role and insert into college_mentors if the user exists but does not have the role
INSERT INTO college_mentors (uid, institute_id, department_id)
VALUES (
        existing_user.id,
        add_college_mentor.institute_id,
        add_college_mentor.department_id
    );
-- Assign the dynamically fetched college-mentor role to the user
INSERT INTO user_roles (uid, role_id)
VALUES (existing_user.id, college_mentor_role_id);
END IF;
END IF;
-- Step 8: Return the user's id, auth_id, new_user flag, has_role flag, and is_verified flag
RETURN QUERY
SELECT existing_user.id,
    existing_user.auth_id,
    new_user,
    has_role,
    is_verified;
END;
$$;