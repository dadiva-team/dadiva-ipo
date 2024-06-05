using System.Text.Json.Serialization;
using DadivaAPI.domain;
using DadivaAPI.repositories.utils;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

namespace DadivaAPI.repositories.form
{
    public class FormRepositoryPGSQL(NpgsqlDataSource dataSource) : IFormRepository
    {
        public async Task<Form?> GetForm()
        {
            return await PGSQLUtils.InTransaction(dataSource, async command =>
            {
                // Fetch groups
                command.CommandText = "SELECT group_id, group_name FROM question_groups";
                List<QuestionGroup> groups = new List<QuestionGroup>();

                // Temporary storage for group ids and names
                List<(int groupId, string groupName)> groupData = new List<(int, string)>();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var groupId = reader.GetInt32(0);
                        var groupName = reader.GetString(1);
                        groupData.Add((groupId, groupName));
                    }
                }

                // Fetch questions for each group
                foreach (var (groupId, groupName) in groupData)
                {
                    var questions = await GetQuestions(command, groupId);
                    groups.Add(new QuestionGroup(groupName, questions));
                }

                // Fetch rules
                command.CommandText = @"
                    SELECT r.id, r.event_type, r.event_params, lc.id as condition_id, lc.condition_type, ec.fact, ec.operator, ec.value
                    FROM rules r
                    LEFT JOIN logical_conditions lc ON r.id = lc.rule_id
                    LEFT JOIN evaluation_conditions ec ON lc.id = ec.condition_id";

                List<Rule> rules = new List<Rule>();

                using (var reader = await command.ExecuteReaderAsync())
                {
                    var ruleDict =
                        new Dictionary<int, (string EventType, string? EventParams, List<Condition> Conditions)>();

                    while (await reader.ReadAsync())
                    {
                        var ruleId = reader.GetInt32(0);
                        var eventType = reader.GetString(1);
                        var eventParams = reader.IsDBNull(2) ? null : reader.GetString(2);
                        var conditionId = reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3);
                        var conditionType = reader.IsDBNull(4) ? null : reader.GetString(4);
                        var fact = reader.IsDBNull(5) ? null : reader.GetString(5);
                        var op = reader.IsDBNull(6) ? null : reader.GetString(6);
                        var value = reader.IsDBNull(7) ? null : reader.GetString(7);

                        if (!ruleDict.ContainsKey(ruleId))
                        {
                            ruleDict[ruleId] = (eventType, eventParams, new List<Condition>());
                        }

                        if (fact != null && op != null && value != null)
                        {
                            ruleDict[ruleId].Conditions
                                .Add(new EvaluationCondition(fact, Enum.Parse<Operator>(op), value));
                        }
                        else if (conditionType != null)
                        {
                            var nestedCondition = new LogicalCondition(
                                conditionType == "all" ? new List<Condition>() : null,
                                conditionType == "any" ? new List<Condition>() : null
                            );
                            ruleDict[ruleId].Conditions.Add(nestedCondition);
                        }
                    }

                    foreach (var (ruleId, (eventType, eventParams, conditions)) in ruleDict)
                    {
                        List<Condition>? allConditions = conditions
                            .OfType<LogicalCondition>()
                            .Where(lc => lc.All != null)
                            .SelectMany(lc => lc.All!)
                            .ToList();

                        List<Condition>? anyConditions = conditions
                            .OfType<LogicalCondition>()
                            .Where(lc => lc.Any != null)
                            .SelectMany(lc => lc.Any!)
                            .ToList();
                        

                        allConditions.AddRange(conditions.OfType<EvaluationCondition>());
                        anyConditions.AddRange(conditions.OfType<EvaluationCondition>());

                        LogicalCondition logicalCondition = new LogicalCondition(
                            allConditions.Count > 0 ? allConditions : [],
                            anyConditions.Count > 0 ? anyConditions : null
                        );

                        rules.Add(new Rule(logicalCondition,
                            new Event(Enum.Parse<EventType>(eventType),
                                eventParams != null ? new EventParams(eventParams) : null)));
                    }
                }

                return new Form(groups, rules);
            });
        }

        private async Task<List<Question>> GetQuestions(NpgsqlCommand command, int groupId)
        {
            command.CommandText = @"SELECT id, text, response_type FROM questions WHERE group_id = @groupId";
            command.Parameters.Clear();
            command.Parameters.AddWithValue("@groupId", groupId);

            List<Question> questions = new List<Question>();

            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    var questionId = reader.GetString(0);
                    var text = reader.GetString(1);
                    var type = Enum.Parse<ResponseType>(reader.GetString(2));

                    questions.Add(new Question(questionId, text, type, null));
                }
            }

            return questions;
        }

        public async Task<Form> EditForm(Form form)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> EditInconsistencies(Inconsistencies inconsistencies)
        {
            throw new NotImplementedException();
        }

        public async Task<Inconsistencies> GetInconsistencies()
        {
            throw new NotImplementedException();
        }

        public async Task<Submission> GetSubmission(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Dictionary<int, Submission>> GetSubmissions()
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SubmitForm(Submission submission, int id)
        {
            throw new NotImplementedException();
        }
    }
}
