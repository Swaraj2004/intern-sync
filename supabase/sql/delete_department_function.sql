CREATE OR REPLACE FUNCTION delete_department (
        -- The department coordinator to be deleted
        user_id uuid,
        -- The institute the department belongs to (updated to uuid)
        institute_id uuid,
        -- The user making the request
        requesting_user_id uuid
    ) RETURNS json LANGUAGE plpgsql AS $$
DECLARE department RECORD;
institute_record RECORD;
role_count integer;
is_user_deleted boolean := false;
department_role_id uuid;
BEGIN -- Step 1: Retrieve the 'department-coordinator' role ID from the roles table
SELECT id INTO department_role_id
FROM roles
WHERE name = 'department-coordinator';
-- If the role 'department-coordinator' does not exist, raise an error
IF NOT FOUND THEN RAISE EXCEPTION 'Role "department-coordinator" does not exist.';
END IF;
-- Step 2: Ensure the requesting user is an 'institute-coordinator'
SELECT i.uid INTO institute_record
FROM institutes i
    JOIN users u ON u.id = i.uid
    JOIN user_roles ur ON ur.uid = u.id
    JOIN roles r ON ur.role_id = r.id
    JOIN departments d ON d.institute_id = i.uid
WHERE u.id = requesting_user_id
    AND r.name = 'institute-coordinator'
    AND i.uid = delete_department.institute_id
    AND d.uid = user_id;
-- If no permissions found, raise an exception
IF NOT FOUND THEN RAISE EXCEPTION 'User does not have permission to delete this department.';
END IF;
-- Step 3: Try to find the department by uid (user_id)
SELECT * INTO department
FROM departments
WHERE departments.uid = user_id;
-- If department does not exist, raise a notice and exit
IF NOT FOUND THEN RAISE NOTICE 'No department found for user_id %.',
user_id;
RETURN json_build_object('is_user_deleted', is_user_deleted);
END IF;
-- Step 4: Delete the specific role associated with the department coordinator
DELETE FROM user_roles
WHERE user_roles.uid = user_id
    AND user_roles.role_id = department_role_id;
-- Step 5: Delete the department associated with the user
DELETE FROM departments
WHERE departments.uid = user_id;
-- Step 6: Check if the user has any other roles
SELECT COUNT(*) INTO role_count
FROM user_roles
WHERE user_roles.uid = user_id;
-- Step 7: If the user has no other roles, delete the user and set the flag
IF role_count = 0 THEN
DELETE FROM users
WHERE users.id = user_id;
is_user_deleted := true;
-- Set to true since the user is deleted
RAISE NOTICE 'User % and their associated department and role have been deleted.',
user_id;
ELSE RAISE NOTICE 'Department and role for user_id % have been deleted, but user still has other roles.',
user_id;
END IF;
-- Return a JSON object with whether the user was deleted
RETURN json_build_object('is_user_deleted', is_user_deleted);
END;
$$;