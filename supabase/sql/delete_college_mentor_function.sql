CREATE OR REPLACE FUNCTION delete_college_mentor(
        -- The college mentor to be deleted
        user_id uuid,
        -- The institute the mentor belongs to (updated to uuid)
        institute_id uuid,
        -- The user making the request
        requesting_user_id uuid,
        -- The department the mentor belongs to (optional)
        department_id uuid DEFAULT NULL
    ) RETURNS json LANGUAGE plpgsql AS $$
DECLARE mentor RECORD;
role_count integer;
is_user_deleted boolean := false;
college_mentor_role_id uuid;
is_institute_coordinator boolean := false;
is_department_coordinator boolean := false;
BEGIN -- Step 1: Retrieve the 'college-mentor' role ID from the roles table
SELECT id INTO college_mentor_role_id
FROM roles
WHERE name = 'college-mentor';
-- If the role 'college-mentor' does not exist, raise an error
IF NOT FOUND THEN RAISE EXCEPTION 'Role "college-mentor" does not exist.';
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
            AND i.uid = delete_college_mentor.institute_id
    ) INTO is_institute_coordinator;
-- Step 3: Check if the requesting user is a 'department-coordinator' (only if department_id is provided)
IF department_id IS NOT NULL THEN
SELECT EXISTS (
        SELECT 1
        FROM departments d
            JOIN users u ON u.id = d.uid
            JOIN user_roles ur ON ur.uid = u.id
            JOIN roles r ON ur.role_id = r.id
        WHERE u.id = requesting_user_id
            AND r.name = 'department-coordinator'
            AND d.institute_id = delete_college_mentor.institute_id
            AND d.uid = delete_college_mentor.department_id
    ) INTO is_department_coordinator;
END IF;
-- Step 4: Raise an error if the user does not have the correct permissions
IF NOT is_institute_coordinator
AND NOT is_department_coordinator THEN RAISE EXCEPTION 'User does not have permission to remove college mentors.';
END IF;
-- Step 5: Try to find the college mentor in the database
SELECT * INTO mentor
FROM college_mentors
WHERE college_mentors.uid = user_id;
-- If college mentor does not exist, raise a notice and exit
IF NOT FOUND THEN RAISE NOTICE 'No college mentor found for user_id %.',
user_id;
RETURN json_build_object('is_user_deleted', is_user_deleted);
END IF;
-- Step 6: Delete the specific role associated with the college mentor
DELETE FROM user_roles
WHERE user_roles.uid = user_id
    AND user_roles.role_id = college_mentor_role_id;
-- Step 7: Delete the college mentor record
DELETE FROM college_mentors
WHERE college_mentors.uid = user_id;
-- Step 8: Check if the user has any other roles
SELECT COUNT(*) INTO role_count
FROM user_roles
WHERE user_roles.uid = user_id;
-- Step 9: If the user has no other roles, delete the user and set the flag
IF role_count = 0 THEN
DELETE FROM users
WHERE users.id = user_id;
is_user_deleted := true;
-- Set to true since the user is deleted
RAISE NOTICE 'User % and their associated college mentor role have been deleted.',
user_id;
ELSE RAISE NOTICE 'College mentor for user_id % has been deleted, but the user still has other roles.',
user_id;
END IF;
-- Step 10: Return a JSON object with whether the user was deleted
RETURN json_build_object('is_user_deleted', is_user_deleted);
END;
$$;