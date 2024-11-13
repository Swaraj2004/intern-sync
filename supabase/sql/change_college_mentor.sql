CREATE OR REPLACE FUNCTION change_college_mentor(
        student_id UUID,
        new_college_mentor_id UUID
    ) RETURNS VOID LANGUAGE plpgsql AS $$ BEGIN -- Update the college_mentor_id in the internships table
UPDATE internships
SET college_mentor_id = new_college_mentor_id
WHERE internships.student_id = change_college_mentor.student_id;
-- Update the college_mentor_id in the students table
UPDATE students
SET college_mentor_id = new_college_mentor_id
WHERE students.uid = change_college_mentor.student_id;
-- Update the college_mentor_id in the student_attendance_requests table
UPDATE student_attendance_requests
SET college_mentor_id = new_college_mentor_id
WHERE student_attendance_requests.student_id = change_college_mentor.student_id;
-- Notify that the college_mentor_id has been changed
RAISE NOTICE 'College mentor updated successfully.';
END;
$$;