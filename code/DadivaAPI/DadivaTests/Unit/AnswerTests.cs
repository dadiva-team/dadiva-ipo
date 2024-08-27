using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.routes.form.models;
using DadivaAPI.utils;

namespace DadivaTests.Unit;

public class AnswerTests
{
    [Fact]
    public void StringAnswerValidateAnswerReturnsFalseIfEmptyString()
    {
        var answer = new StringAnswer("");
        
        var valid = answer.ValidateAnswer();
        
        Assert.False(valid);
    }
    
    [Fact]
    public void StringAnswerValidateAnswerReturnsTrueIfStringIsNotEmpty()
    {
        var answer = new StringAnswer("answer");
        
        var valid = answer.ValidateAnswer();
        
        Assert.True(valid);
    }
    
    [Fact]
    public void BooleanAnswerValidateAnswerReturnsTrue()
    {
        var answer1 = new BooleanAnswer(true);
        var answer2 = new BooleanAnswer(false);
        
        var valid = answer1.ValidateAnswer() && answer2.ValidateAnswer();
        
        Assert.True(valid);
    }
    
    [Fact]
    public void StringListAnswerValidateAnswerReturnsFalseIfAnyStringIsEmpty()
    {
        var answer = new StringListAnswer(new List<string> { "answer", "" });
        
        var valid = answer.ValidateAnswer();
        
        Assert.False(valid);
    }
    
    [Fact]
    public void StringListAnswerValidateAnswerReturnsTrueIfAllStringsAreNotEmpty()
    {
        var answer = new StringListAnswer(new List<string> { "answer1", "answer2" });
        
        var valid = answer.ValidateAnswer();
        
        Assert.True(valid);
    }
    
    [Fact]
    public void TestAnswerConverter()
    {
        var jsonString = @"{
            ""questionId"": ""1"",
            ""answer"": ""yes""
        }";

        var options = new JsonSerializerOptions
        {
            Converters = { new AnswerConverter() }
        };

        var result = JsonSerializer.Deserialize<AnsweredQuestionModel>(jsonString, options);

        Assert.NotNull(result);
        Assert.Equal("1", result.QuestionId);
        Assert.IsType<StringAnswer>(result.Answer);
        Assert.Equal("yes", ((StringAnswer)result.Answer).Content);
    }
}