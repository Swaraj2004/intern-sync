CREATE OR REPLACE FUNCTION get_total_working_days(
        start_date date,
        end_date date,
        internship_id uuid,
        region text
    ) RETURNS integer LANGUAGE plpgsql AS $$
DECLARE total_working_days INT;
approved_requests RECORD;
BEGIN -- Calculate working days from Monday to Friday, excluding national and regional holidays
SELECT COUNT (*) INTO total_working_days
FROM generate_series(start_date, end_date, '1 day'::INTERVAL) AS date_series(date)
WHERE to_char(date_series.date, 'FMDay') IN (
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
    )
    AND date_series.date NOT IN (
        -- Exclude national and regional holidays
        SELECT holiday_date
        FROM holidays
        WHERE holiday_type = 'national'
            OR (
                holiday_type = 'regional'
                AND holidays.region = get_total_working_days.region
            )
    );
-- Adjust for student requests (add or remove days based on approved holidays/working days)
FOR approved_requests IN
SELECT date,
    request_type
FROM student_attendance_requests
WHERE student_attendance_requests.internship_id = get_total_working_days.internship_id
    AND approved = TRUE
    AND date BETWEEN start_date AND end_date -- Ensure request is within the specified date range
    LOOP IF approved_requests.request_type = 'holiday'
    AND to_char(approved_requests.date, 'FMDay') IN (
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
    ) THEN -- Subtract a working day if a holiday was approved on a weekday
    total_working_days := total_working_days - 1;
ELSIF approved_requests.request_type = 'working_day'
AND to_char(approved_requests.date, 'FMDay') IN ('Saturday', 'Sunday') THEN -- Add a working day if a weekend was marked as a working day
total_working_days := total_working_days + 1;
END IF;
END LOOP;
total_working_days := total_working_days - (
    SELECT COUNT (*)
    FROM attendance
    WHERE attendance.internship_id = get_total_working_days.internship_id
        AND date BETWEEN start_date AND end_date
        AND status = 'holiday'
        AND to_char(date, 'FMDay') IN (
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
        )
);
RETURN total_working_days;
END;
$$;