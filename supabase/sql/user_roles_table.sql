CREATE TABLE user_roles(
  uid uuid,
  role_id uuid,
  PRIMARY KEY (uid, role_id),
  FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);