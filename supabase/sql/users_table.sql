CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid UNIQUE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  contact bigint UNIQUE,
  is_registered boolean NOT NULL DEFAULT FALSE,
  is_verified boolean NOT NULL DEFAULT FALSE,
  created_at timestamp with time zone NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'::text)
);