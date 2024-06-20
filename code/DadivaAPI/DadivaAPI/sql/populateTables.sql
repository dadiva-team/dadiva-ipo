INSERT INTO users (nic, name, hashed_password, role)
VALUES (111111111, 'Dr. Doe', 'MegaPassword123!hashed', 'doctor');

INSERT INTO forms (added_by, added_on, rules)
VALUES (111111111, NOW(), '[
  {
    "conditions": {
      "all": [
        {
          "fact": "Q1",
          "operator": "equal",
          "value": "yes"
        }
      ],
      "any": null
    },
    "event": {
      "type": "showQuestion",
      "params": {
          "id": "Q1"
      }
    }
  }
]');

INSERT INTO question_groups (form_id, group_name)
VALUES (1, 'Group 1'),
       (1, 'Group 2');

INSERT INTO questions (group_id, question_text_id, question_text, response_type)
VALUES (1, 'q1', 'What is your name?', 'text'),
       (1, 'q2', 'What is your age?', 'text'),
       (2, 'q3', 'What is your country?', 'text'),
       (2, 'q4', 'What is your profession?', 'dropdown');

INSERT INTO options (question_id, option_text)
VALUES (4, 'Doctor'),
       (4, 'Engineer'),
       (4, 'Student');

SELECT *
FROM latest_form;

-- edit the form rules
UPDATE forms
SET rules = '[
  {
    "Conditions": {
      "All": [
        {
          "Fact": "Q1",
          "operator": "equal",
          "Value": "yes"
        }
      ],
      "Any": null
    },
    "Event": {
      "Type": "showQuestion",
      "Params": {
          "Id": "Q1"
      }
    }
  }
]'
WHERE form_id = 1;