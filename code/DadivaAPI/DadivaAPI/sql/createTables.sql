-- Create table Users
CREATE TABLE users (
    nic INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

INSERT INTO users (nic, name, hashed_password, role) VALUES (111111111, 'Dr. Doe', 'MegaPassword123!hashed', 'doctor');