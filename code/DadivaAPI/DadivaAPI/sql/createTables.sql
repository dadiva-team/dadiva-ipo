BEGIN;

-- Create table Users
CREATE TABLE users
(
    nic             INT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role            VARCHAR(255) NOT NULL
);

CREATE TABLE forms
(
    form_id  SERIAL PRIMARY KEY,
    added_by INT       NOT NULL,
    added_on TIMESTAMP NOT NULL,
    rules   JSONB NOT NULL,
    FOREIGN KEY (added_by) REFERENCES users (nic)
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
    question_id      SERIAL PRIMARY KEY,
    group_id         INT          NOT NULL,
    question_text_id VARCHAR(255) NOT NULL,
    question_text    TEXT         NOT NULL,
    response_type    VARCHAR(50)  NOT NULL,
    FOREIGN KEY (group_id) REFERENCES question_groups (group_id),
    CHECK (response_type IN ('boolean', 'text', 'dropdown'))
);

CREATE TABLE options
(
    option_id   SERIAL PRIMARY KEY,
    question_id INT          NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE TABLE conditions
(
    condition_id SERIAL PRIMARY KEY,
    all_id       INT,
    any_id       INT
);

CREATE TABLE logical_conditions
(
    condition_id INT PRIMARY KEY,
    FOREIGN KEY (condition_id) REFERENCES conditions (condition_id)
);

ALTER TABLE conditions
    ADD CONSTRAINT fk_all
        FOREIGN KEY (all_id) REFERENCES logical_conditions (condition_id);

ALTER TABLE conditions
    ADD CONSTRAINT fk_any
        FOREIGN KEY (any_id) REFERENCES logical_conditions (condition_id);

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

CREATE TABLE answers
(
    answer_id     SERIAL PRIMARY KEY,
    submission_id INT  NOT NULL,
    question_id   INT  NOT NULL,
    answer_text   TEXT NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES submissions (id),
    FOREIGN KEY (question_id) REFERENCES questions (question_id)
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
    review_id   INT NOT NULL,
    question_id INT NOT NULL,
    note_text   TEXT,
    FOREIGN KEY (review_id) REFERENCES reviews (review_id),
    FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

CREATE OR REPLACE VIEW latest_form AS
WITH latest_form AS (SELECT f.form_id,
                            f.added_on,
                            f.rules,
                            u.nic,
                            u.name,
                            u.hashed_password,
                            u.role
                     FROM forms f
                              JOIN users u ON f.added_by = u.nic
                     ORDER BY f.added_on DESC
                     LIMIT 1)
SELECT lf.form_id,
       lf.added_on,
       lf.rules,
       lf.nic,
       lf.name,
       lf.hashed_password,
       lf.role,
       g.group_name,
       q.question_id,
       q.question_text_id,
       q.question_text,
       q.response_type,
       o.option_text
FROM latest_form lf
         LEFT JOIN question_groups g ON lf.form_id = g.form_id
         LEFT JOIN questions q ON g.group_id = q.group_id
         LEFT JOIN options o ON q.question_id = o.question_id
ORDER BY q.question_id;
COMMIT;