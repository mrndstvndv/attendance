-- Make service_used nullable in login_sessions
ALTER TABLE login_sessions
ALTER COLUMN service_used DROP NOT NULL;

-- Also make service_selected_at nullable
ALTER TABLE login_sessions
ALTER COLUMN service_selected_at DROP NOT NULL;
