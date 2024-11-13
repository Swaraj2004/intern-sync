CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    holiday_date DATE NOT NULL,
    description TEXT,
    holiday_type TEXT CHECK (holiday_type IN ('national', 'regional')) NOT NULL,
    region TEXT -- For regional holidays, e.g., 'Maharashtra'
);