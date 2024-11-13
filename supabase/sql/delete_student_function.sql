CREATE OR REPLACE FUNCTION delete_student(
        -- The student to be deleted
        user_id uuid,
        -- The institute the student belongs to (updated to uuid)
        institute_id uuid,
        -- The user making the request
        requesting_user_id uuid,
        -- The department the student belongs to (optional)
        department_id uuid DEFAULT NULL
    ) RETURNS json LANGUAGE plpgsql AS $$
DECLARE student RECORD;
role_count integer;
is_user_deleted boolean := false;
student_role_id uuid;
BEGIN -- Step 1: Retrieve the 'student' role ID from the roles table
SELECT id INTO student_role_id
FROM roles
WHERE name = 'student';
-- If the role 'student' does not exist, raise an error
IF NOT FOUND THEN RAISE EXCEPTION 'Role "student" does not exist.';
END IF;
-- Step 2: Ensure the requesting user is either 'institute-coordinator' or 'department-coordinator'
IF department_id IS NOT NULL THEN -- If department_id is provided, check for 'department-coordinator' permission
SELECT 1 INTO student
FROM users u
    JOIN user_roles ur ON u.id = ur.uid
    JOIN roles r ON ur.role_id = r.id
    JOIN departments d ON d.uid = ur.uid
WHERE u.id = requesting_user_id
    AND r.name = 'department-coordinator'
    AND d.institute_id = delete_student.institute_id
    AND d.uid = delete_student.department_id;
ELSE -- If department_id is not provided, check for 'institute-coordinator' permission
SELECT 1 INTO student
FROM users u
    JOIN user_roles ur ON u.id = ur.uid
    JOIN roles r ON ur.role_id = r.id
    JOIN institutes i ON i.uid = ur.uid
WHERE u.id = requesting_user_id
    AND r.name = 'institute-coordinator'
    AND i.uid = delete_student.institute_id;
END IF;
-- If no permissions found, raise an exception
IF NOT FOUND THEN RAISE EXCEPTION 'User does not have permission to remove students.';
END IF;
-- Step 3: Try to find the student in the database
SELECT * INTO student
FROM students
WHERE students.uid = user_id;
-- If student does not exist, raise a notice and exit
IF NOT FOUND THEN RAISE NOTICE 'No student found for user_id %.',
user_id;
RETURN json_build_object('is_user_deleted', is_user_deleted);
END IF;
-- Step 4: Delete the specific role associated with the student
DELETE FROM user_roles
WHERE user_roles.uid = user_id
    AND user_roles.role_id = student_role_id;
-- Step 5: Delete the student record
DELETE FROM students
WHERE students.uid = user_id;
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
RAISE NOTICE 'User % and their associated student role have been deleted.',
user_id;
ELSE RAISE NOTICE 'Student for user_id % has been deleted, but the user still has other roles.',
user_id;
END IF;
-- Step 8: Return a JSON object with whether the user was deleted
RETURN json_build_object('is_user_deleted', is_user_deleted);
END;
$$;