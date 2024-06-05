-- Create table Users
CREATE TABLE users
(
    nic             INT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role            VARCHAR(255) NOT NULL
);

INSERT INTO users (nic, name, hashed_password, role)
VALUES (111111111, 'Dr. Doe', 'MegaPassword123!hashed', 'doctor');


CREATE TABLE forms
(
    form_id SERIAL PRIMARY KEY,
    version INT NOT NULL
);


CREATE TABLE submissions
(
    id              SERIAL PRIMARY KEY,
    nic             INT          NOT NULL,
    form_id         INT          NOT NULL,
    submission_date DATE         NOT NULL,
    status          VARCHAR(255) NOT NULL,
    FOREIGN KEY (nic) REFERENCES users (nic),
    FOREIGN KEY (form_id) REFERENCES forms (form_id)
);



CREATE TABLE question_groups
(
    group_id   SERIAL PRIMARY KEY,
    form_id    INT          NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (form_id) REFERENCES forms (form_id)
);

CREATE TABLE questions
(
    id             VARCHAR(50) PRIMARY KEY,
    group_id       INT         NOT NULL,
    text           TEXT        NOT NULL,
    response_type  VARCHAR(50) NOT NULL,
    question_order INT         NOT NULL,
    FOREIGN KEY (group_id) REFERENCES question_groups (group_id),
    CHECK (response_type IN ('boolean', 'text', 'dropdown'))
);

CREATE TABLE options
(
    id          SERIAL PRIMARY KEY,
    question_id VARCHAR(50)  NOT NULL,
    text        VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

CREATE TABLE rules
(
    id           SERIAL PRIMARY KEY,
    form_id      INT         NOT NULL DEFAULT 1,
    event_type   VARCHAR(50) NOT NULL,
    event_params varchar(50),
    FOREIGN KEY (form_id) REFERENCES forms (form_id)
);

-- Table to store rule conditions
CREATE TABLE logical_conditions
(
    id             SERIAL PRIMARY KEY,
    rule_id        INT NOT NULL,
    condition_type VARCHAR(50),
    FOREIGN KEY (rule_id) REFERENCES rules (id)
);

CREATE TABLE evaluation_conditions
(
    id           SERIAL PRIMARY KEY,
    condition_id INT REFERENCES logical_conditions (id),
    fact         TEXT,
    operator     TEXT,
    value        TEXT
);


-- Table to link rules to questions
CREATE TABLE question_rules
(
    id          SERIAL PRIMARY KEY,
    question_id VARCHAR(50) NOT NULL,
    rule_id     INT         NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions (id),
    FOREIGN KEY (rule_id) REFERENCES rules (id)
);


CREATE TABLE answers
(
    answer_id     SERIAL PRIMARY KEY,
    submission_id INT         NOT NULL,
    question_id   VARCHAR(50) NOT NULL,
    answer_text   TEXT        NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES submissions (id),
    FOREIGN KEY (question_id) REFERENCES questions (id)
);


CREATE TABLE reviews
(
    review_id     SERIAL PRIMARY KEY,
    submission_id INT          NOT NULL,
    doctor_nic    INT          NOT NULL,
    status        VARCHAR(255) NOT NULL,
    final_note    TEXT,
    review_date   TIMESTAMP    NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES submissions (id),
    FOREIGN KEY (doctor_nic) REFERENCES users (nic)
);

CREATE TABLE notes
(
    note_id     SERIAL PRIMARY KEY,
    review_id   INT         NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    note_text   TEXT,
    FOREIGN KEY (review_id) REFERENCES reviews (review_id),
    FOREIGN KEY (question_id) REFERENCES questions (id)
);
