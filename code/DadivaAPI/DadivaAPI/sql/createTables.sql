-- Create table Users
CREATE TABLE users (
    nic INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

INSERT INTO users (nic, name, hashed_password, role) VALUES (111111111, 'Dr. Doe', 'MegaPassword123!hashed', 'doctor');

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    nic INT NOT NULL,
    form_id INT NOT NULL,
    submission_date DATE NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (nic) REFERENCES users(nic),
    FOREIGN KEY (form_id) REFERENCES forms(form_id)
);

CREATE TABLE forms (
    form_id SERIAL PRIMARY KEY
);

CREATE TABLE question_groups (
    group_id SERIAL PRIMARY KEY,
    form_id INT NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (form_id) REFERENCES forms(form_id)
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    question_text TEXT NOT NULL,
    response_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (group_id) REFERENCES question_groups(group_id),
    CHECK (response_type IN ('boolean', 'text', 'dropdown'))
);

CREATE TABLE options (
                         option_id SERIAL PRIMARY KEY,
                         question_id INT NOT NULL,
                         option_text VARCHAR(255) NOT NULL,
                         FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE answers (
                         answer_id SERIAL PRIMARY KEY,
                         submission_id INT NOT NULL,
                         question_id INT NOT NULL,
                         answer_text TEXT NOT NULL,
                         FOREIGN KEY (submission_id) REFERENCES submissions(id),
                         FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

CREATE TABLE rules (
                       rule_id SERIAL PRIMARY KEY,
                       form_id INT NOT NULL,
                       event_type VARCHAR(50) NOT NULL,
                       event_params VARCHAR(255),
                       FOREIGN KEY (form_id) REFERENCES forms(form_id),
                       CHECK (event_type IN ('showQuestion', 'nextGroup', 'showReview', 'hideQuestion', 'showInconsistency'))
);

CREATE TABLE conditions (
                            condition_id SERIAL PRIMARY KEY,
                            rule_id INT NOT NULL,
                            fact VARCHAR(255) NOT NULL,
                            operator VARCHAR(50) NOT NULL,
                            value VARCHAR(255) NOT NULL,
                            FOREIGN KEY (rule_id) REFERENCES rules(rule_id),
                            CHECK (operator IN ('equal', 'notEqual', 'lessThan', 'lessThanInclusive', 'greaterThan', 'greaterThanInclusive', 'in', 'notIn', 'contains', 'doesNotContain'))
);

CREATE TABLE reviews (
                         review_id SERIAL PRIMARY KEY,
                         submission_id INT NOT NULL,
                         doctor_nic INT NOT NULL,
                         status VARCHAR(255) NOT NULL,
                         final_note TEXT,
                         review_date TIMESTAMP NOT NULL,
                         FOREIGN KEY (submission_id) REFERENCES submissions(id),
                         FOREIGN KEY (doctor_nic) REFERENCES users(nic)
);

CREATE TABLE notes (
                       note_id SERIAL PRIMARY KEY,
                       review_id INT NOT NULL,
                       question_id INT NOT NULL,
                       note_text TEXT,
                       FOREIGN KEY (review_id) REFERENCES reviews(review_id),
                       FOREIGN KEY (question_id) REFERENCES questions(question_id)
);