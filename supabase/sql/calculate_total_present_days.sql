CREATE OR REPLACE FUNCTION get_total_present_days(student_id UUID, internship_id UUID) RETURNS INT AS $$
DECLARE total_present_days INT;
BEGIN -- Count the total present days from the attendance table
SELECT COUNT(*) INTO total_present_days
FROM attendance
WHERE attendance.internship_id = get_total_present_days.internship_id
    AND attendance.status = 'present';
RETURN total_present_days;
EXCEPTION
WHEN no_data_found THEN RAISE EXCEPTION 'Attendance data not found for the provided student and internship.';
END;
$$ LANGUAGE plpgsql;