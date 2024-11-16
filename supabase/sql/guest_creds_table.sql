-- Create table for guest login credentials
CREATE TABLE guest_creds (role TEXT PRIMARY KEY, email TEXT, password TEXT);
-- Use your actual emails and passwords
INSERT INTO guest_creds (role, email, password)
VALUES (
        'institute-coordinator',
        'guest.institute.coordinator@example.com',
        'password123'
    ),
    (
        'department-coordinator',
        'guest.department.coordinator@example.com',
        'password456'
    ),
    (
        'college-mentor',
        'guest.college.mentor@example.com',
        'password789'
    ),
    (
        'company-mentor',
        'guest.company.mentor@example.com',
        'password012'
    ),
    (
        'student',
        'guest.student@example.com',
        'password'
    );