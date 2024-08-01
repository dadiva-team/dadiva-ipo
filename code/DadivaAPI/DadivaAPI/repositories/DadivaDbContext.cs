using DadivaAPI.repositories.Entities;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories;

public class DadivaDbContext : DbContext
{
    public DadivaDbContext(DbContextOptions<DadivaDbContext> options) : base(options)
    {
    }
    
    public DbSet<UserEntity> Users { get; set; }
    
    public DbSet<SuspensionEntity> Suspensions { get; set; }
    
    public DbSet<CftEntity> Cfts { get; set; }
    public DbSet<ManualEntryEntity> ManualEntries { get; set; }
    public DbSet<EntryExampleEntity> EntryExamples { get; set; }
    public DbSet<CriteriaEntity> Criterias { get; set; }
    
    public DbSet<TermsEntity> Terms { get; set; }
    
    public DbSet<FormEntity> Forms { get; set; }
    public DbSet<QuestionGroupEntity> QuestionGroups { get; set; }
    public DbSet<QuestionEntity> Questions { get; set; }
    
    public DbSet<RuleEntity> Rules { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    
    public DbSet<NestedConditionEntity> NestedConditions { get; set; }
    public DbSet<ConditionPropertiesEntity> ConditionProperties { get; set; }
    public DbSet<TopLevelConditionEntity> TopLevelConditions { get; set; }
    public DbSet<AllConditionEntity> AllConditions { get; set; }
    public DbSet<AnyConditionEntity> AnyConditions { get; set; }
    public DbSet<NotConditionEntity> NotConditions { get; set; }
    
    public DbSet<InconsistencyEntity> Inconsistencies { get; set; }
    
    public DbSet<SubmissionEntity> Submissions { get; set; }
    public DbSet<AnsweredQuestionEntity> AnsweredQuestions { get; set; }
    public DbSet<AnswerEntity> Answers { get; set; }
    public DbSet<StringAnswerEntity> StringAnswers { get; set; }
    public DbSet<StringListAnswerEntity> StringListAnswers { get; set; }
    public DbSet<BooleanAnswerEntity> BooleanAnswers { get; set; }
    
    public DbSet<ReviewEntity> Reviews { get; set; }
}