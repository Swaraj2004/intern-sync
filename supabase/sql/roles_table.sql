-- Create the role table with UUID as the primary key
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL
);
-- Insert predefined roles into the role table
INSERT INTO roles (id, name)
VALUES (uuid_generate_v4(), 'student'),
  (uuid_generate_v4(), 'college-mentor'),
  (uuid_generate_v4(), 'department-coordinator'),
  (uuid_generate_v4(), 'institute-coordinator'),
  (uuid_generate_v4(), 'company-mentor');