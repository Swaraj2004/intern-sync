CREATE OR REPLACE FUNCTION check_holiday_for_student(
        student_id UUID,
        internship_id UUID,
        check_date DATE
    ) RETURNS BOOLEAN AS $$
DECLARE is_holiday BOOLEAN := FALSE;
student_region TEXT;
BEGIN -- 1. Check if the date is a Saturday or Sunday (trim to avoid space issues)
IF trim(
    to_char(check_holiday_for_student.check_date, 'Day')
) IN ('Saturday', 'Sunday') THEN is_holiday := TRUE;
END IF;
-- 2. Get student's region from the internships table
SELECT region INTO student_region
FROM internships
WHERE internships.id = check_holiday_for_student.internship_id
    AND internships.student_id = check_holiday_for_student.student_id;
-- 3. Check if the date is a national holiday
IF EXISTS (
    SELECT 1
    FROM holidays
    WHERE holidays.holiday_date = check_holiday_for_student.check_date
        AND holidays.holiday_type = 'national'
) THEN is_holiday := TRUE;
END IF;
-- 4. Check if the date is a regional holiday
IF EXISTS (
    SELECT 1
    FROM holidays
    WHERE holidays.holiday_date = check_holiday_for_student.check_date
        AND holidays.holiday_type = 'regional'
        AND holidays.region = student_region -- Match the student's region
) THEN is_holiday := TRUE;
END IF;
-- 5. Check if the student has a mentor-approved holiday request for this date
IF EXISTS (
    SELECT 1
    FROM student_attendance_requests
    WHERE student_attendance_requests.date = check_holiday_for_student.check_date
        AND student_attendance_requests.student_id = check_holiday_for_student.student_id
        AND student_attendance_requests.internship_id = check_holiday_for_student.internship_id
        AND student_attendance_requests.request_type = 'holiday'
        AND student_attendance_requests.approved = TRUE -- Only approved requests count
) THEN is_holiday := TRUE;
END IF;
-- 6. Check if the student has a mentor-approved working day request for this date
IF EXISTS (
    SELECT 1
    FROM student_attendance_requests
    WHERE student_attendance_requests.date = check_holiday_for_student.check_date
        AND student_attendance_requests.student_id = check_holiday_for_student.student_id
        AND student_attendance_requests.internship_id = check_holiday_for_student.internship_id
        AND student_attendance_requests.request_type = 'working_day'
        AND student_attendance_requests.approved = TRUE -- Only approved requests count
) THEN -- If it's a working day, override the holiday status
is_holiday := FALSE;
END IF;
RETURN is_holiday;
END;
$$ LANGUAGE plpgsql;