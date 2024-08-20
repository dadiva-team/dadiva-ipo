using DadivaAPI.domain;

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
}