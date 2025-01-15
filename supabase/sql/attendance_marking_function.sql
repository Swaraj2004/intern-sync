CREATE OR REPLACE FUNCTION mark_attendance(
    attendance_id UUID,
    student_id UUID,
    internship_id UUID,
    attendance_date DATE,
    check_time TIME,
    work_from_home BOOLEAN,
    latitude FLOAT8,
    longitude FLOAT8,
    is_check_out BOOLEAN
  ) RETURNS VOID AS $$
DECLARE student_home_lat FLOAT8;
student_home_long FLOAT8;
student_home_radius FLOAT8;
company_lat FLOAT8;
company_long FLOAT8;
company_rad FLOAT8;
distance_home FLOAT8;
distance_company FLOAT8;
existing_in_time TIME;
existing_out_time TIME;
earth_radius FLOAT8 := 6371000;
BEGIN -- Fetch student's home location data
SELECT home_latitude,
  home_longitude,
  home_radius INTO student_home_lat,
  student_home_long,
  student_home_radius
FROM students
WHERE uid = student_id;
-- Fetch company's office location data
SELECT company_latitude,
  company_longitude,
  company_radius INTO company_lat,
  company_long,
  company_rad
FROM company_mentors
  JOIN internships ON internships.company_mentor_id = company_mentors.uid
WHERE internships.id = internship_id;
-- Calculate distance to student's home
distance_home := (
  earth_radius * acos(
    cos(radians(student_home_lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(student_home_long)) + sin(radians(student_home_lat)) * sin(radians(latitude))
  )
);
-- Calculate distance to company's office
distance_company := (
  earth_radius * acos(
    cos(radians(company_lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(company_long)) + sin(radians(company_lat)) * sin(radians(latitude))
  )
);
-- Check if location is within home or company radius
IF (
  distance_home <= student_home_radius
  AND mark_attendance.work_from_home
)
OR (
  distance_company <= company_rad
  AND NOT mark_attendance.work_from_home
) THEN -- Check if attendance already exists for the day
SELECT in_time,
  out_time INTO existing_in_time,
  existing_out_time
FROM attendance
WHERE id = attendance_id FOR
UPDATE;
-- If attendance record exists, update in_time or out_time based on check-in or check-out
IF FOUND THEN IF NOT is_check_out THEN -- Mark check-in
IF existing_in_time IS NOT NULL THEN RAISE EXCEPTION 'Check-in already marked.';
END IF;
UPDATE attendance
SET in_time = check_time,
  work_from_home = mark_attendance.work_from_home,
  status = 'pending'
WHERE id = attendance_id;
ELSE -- Mark check-out
IF existing_in_time IS NULL THEN RAISE EXCEPTION 'Check-in not done yet, cannot mark check-out.';
ELSIF existing_out_time IS NOT NULL THEN RAISE EXCEPTION 'Check-out already marked.';
END IF;
UPDATE attendance
SET out_time = check_time,
  status = 'pending'
WHERE id = attendance_id;
END IF;
ELSE -- Insert a new attendance record for check-in
IF is_check_out THEN RAISE EXCEPTION 'No existing check-in found for check-out.';
ELSE
INSERT INTO attendance (
    id,
    student_id,
    internship_id,
    date,
    in_time,
    work_from_home,
    status
  )
VALUES (
    attendance_id,
    student_id,
    internship_id,
    attendance_date,
    check_time,
    work_from_home,
    'pending'
  );
END IF;
END IF;
ELSE -- Location is not within the allowed radius
RAISE EXCEPTION 'Location is not within the allowed radius.';
END IF;
END;
$$ LANGUAGE plpgsql;