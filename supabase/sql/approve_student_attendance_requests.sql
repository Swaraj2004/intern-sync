CREATE OR REPLACE FUNCTION approve_student_attendance_requests(
        request_id UUID,
        -- ID of the request in student_attendance_requests table
        mentor_approval BOOLEAN -- TRUE for approval, FALSE for rejection
    ) RETURNS VOID AS $$
DECLARE request_record RECORD;
BEGIN -- Fetch the student request record based on the provided request_id
SELECT * INTO request_record
FROM student_attendance_requests
WHERE id = approve_student_attendance_requests.request_id;
-- Raise an exception if the request is not found
IF NOT FOUND THEN RAISE EXCEPTION 'Attendance request does not exist.' USING ERRCODE = 'no_data_found';
END IF;
-- Update the student request with mentor's approval decision
UPDATE student_attendance_requests
SET approved = approve_student_attendance_requests.mentor_approval
WHERE id = approve_student_attendance_requests.request_id;
-- If the mentor approves the request, update or insert into the attendance table
IF mentor_approval = TRUE THEN BEGIN -- Check if there's already an attendance record for the request date
IF EXISTS (
    SELECT 1
    FROM attendance
    WHERE date = request_record.date
        AND internship_id = request_record.internship_id
        AND student_id = request_record.student_id
) THEN -- Update the existing attendance record with the request
UPDATE attendance
SET status = CASE
        WHEN request_record.request_type = 'holiday' THEN 'holiday'
        WHEN request_record.request_type = 'working_day' THEN NULL -- Update if needed
    END
WHERE date = request_record.date
    AND internship_id = request_record.internship_id
    AND student_id = request_record.student_id;
ELSE -- Insert a new attendance record with the request
INSERT INTO attendance (id, student_id, internship_id, date, status)
VALUES (
        uuid_generate_v4(),
        request_record.student_id,
        request_record.internship_id,
        request_record.date,
        CASE
            WHEN request_record.request_type = 'holiday' THEN 'holiday'
            WHEN request_record.request_type = 'working_day' THEN NULL -- Insert if needed
        END
    );
END IF;
EXCEPTION
WHEN OTHERS THEN RAISE EXCEPTION 'Error updating or inserting attendance record.';
END;
END IF;
-- Raise an exception if the request is not approved and changes are attempted
IF mentor_approval = FALSE THEN RAISE NOTICE 'Attendance request has been rejected by the mentor';
END IF;
EXCEPTION
WHEN no_data_found THEN RAISE EXCEPTION 'Attendance request does not exist';
WHEN OTHERS THEN RAISE EXCEPTION 'An error occurred during attedance request approval processing.';
END;
$$ LANGUAGE plpgsql;