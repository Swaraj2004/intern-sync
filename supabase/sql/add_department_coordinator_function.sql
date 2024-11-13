CREATE OR REPLACE FUNCTION add_department_coordinator(
        department_coordinator_name text,
        email text,
        department_name text,
        institute_id smallint,
        requesting_user_id uuid
    ) RETURNS TABLE(
        user_id uuid,
        auth_id uuid,
        is_new_user boolean,
        has_role boolean,
        is_verified boolean
    ) LANGUAGE plpgsql AS $$
DECLARE existing_user RECORD;
existing_role RECORD;
institute_record RECORD;
new_user boolean := FALSE;
has_role boolean := FALSE;
is_verified boolean := FALSE;
department_coordinator_role_id uuid;
institute_admin_domain text;
email_domain text;
BEGIN -- Step 1: Retrieve the 'department-coordinator' role ID from the roles table
SELECT id INTO department_coordinator_role_id
FROM roles
WHERE name = 'department-coordinator';
-- If the role 'department-coordinator' does not exist, raise an error
IF NOT FOUND THEN RAISE EXCEPTION 'Role "department-coordinator" does not exist.';
END IF;
-- Step 2: Ensure the requesting user is an 'institute-coordinator' and belongs to the same institute
SELECT i.uid INTO institute_record
FROM institutes i
    JOIN users u ON u.id = i.uid
    JOIN user_roles ur ON ur.uid = u.id
    JOIN roles r ON ur.role_id = r.id
WHERE u.id = requesting_user_id
    AND r.name = 'institute-coordinator'
    AND i.uid = add_department_coordinator.institute_id;
IF NOT FOUND THEN RAISE EXCEPTION 'User does not have permission to add a department coordinator.';
END IF;
--changes
-- Fetch the domain for the specified institute and compare with email domain
SELECT institute_email_domain INTO institute_admin_domain
FROM institutes
WHERE id = add_department_coordinator.institute_id;
IF NOT FOUND THEN RAISE EXCEPTION 'Institute not found.';
END IF;
--check if the institute domain is null
IF institute_admin_domain IS NULL THEN RAISE EXCEPTION 'Please complete profile before adding department'
END IF;
-- Extract the domain from the email
email_domain := split_part(email, '@', 2);
IF email_domain != institute_admin_domain THEN RAISE EXCEPTION 'Email domain does not match the institute student domain.';
END IF;
--end of changes
-- Step 3: Try to find the user by email
SELECT * INTO existing_user
FROM users
WHERE users.email = add_department_coordinator.email;
-- Step 4: If user does not exist, insert the user
IF NOT FOUND THEN
INSERT INTO users(name, email)
VALUES (
        department_coordinator_name,
        add_department_coordinator.email
    )
RETURNING * INTO existing_user;
-- Set new_user flag to true as we inserted a new user
new_user := TRUE;
-- Insert into departments
INSERT INTO departments(name, uid, institute_id)
VALUES (
        department_name,
        existing_user.id,
        add_department_coordinator.institute_id
    );
-- Assign the dynamically fetched department-coordinator role to the user
INSERT INTO user_roles(uid, role_id)
VALUES (existing_user.id, department_coordinator_role_id);
ELSE is_verified := existing_user.is_verified;
-- Step 5: Check if the user already has the department-coordinator role
SELECT * INTO existing_role
FROM user_roles
WHERE uid = existing_user.id
    AND user_roles.role_id = department_coordinator_role_id;
IF FOUND THEN -- User already has the department coordinator role
has_role := TRUE;
RAISE EXCEPTION 'User is already a department coordinator.';
ELSE -- Step 6: Assign the role and insert into departments if the user exists but does not have the role
INSERT INTO departments(name, uid, institute_id)
VALUES (
        department_name,
        existing_user.id,
        add_department_coordinator.institute_id
    );
-- Assign the dynamically fetched department-coordinator role to the user
INSERT INTO user_roles(uid, role_id)
VALUES (existing_user.id, department_coordinator_role_id);
END IF;
END IF;
-- Step 7: Return the user's id, auth_id, new_user flag, has_role flag, and is_verified flag
RETURN QUERY
SELECT existing_user.id,
    existing_user.auth_id,
    new_user,
    has_role,
    is_verified;
END;
$$;