using System.Text.Json;
using DadivaAPI.domain;
using DadivaAPI.utils;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.repositories;

public class DadivaDbContext : DbContext
{
    public DadivaDbContext(DbContextOptions<DadivaDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<Submission> Submissions { get; set; }
    public DbSet<Inconsistencies> Inconsistencies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var options = new JsonSerializerOptions
        {
            Converters = { new AnswerConverter(), new EventConverter(), new ConditionConverter() }
        };

        modelBuilder.Entity<AnsweredQuestion>()
            .Property(aq => aq.Answer)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<IAnswer>(v, options));

        modelBuilder.Entity<Rule>()
            .Property(e => e.Event)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<Event>(v, options));

        modelBuilder.Entity<Rule>()
            .Property(e => e.Conditions)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<LogicalCondition>(v, options)
                );
        
        modelBuilder.Entity<Form>()
            .Property(f => f.Groups)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<List<QuestionGroup>>(v, options));

        modelBuilder.Entity<Form>()
            .Property(f => f.Rules)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<List<Rule>>(v, options));

        modelBuilder.Entity<Form>()
            .Property(f => f.AddedBy)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<User>(v, options));
        
        modelBuilder.Entity<Inconsistencies>()
            .Property(i => i.InconsistencyList)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<List<Rule>>(v, options));
        
        modelBuilder.Entity<Submission>()
            .Property(s => s.AnsweredQuestions)
            .HasConversion(
                v => JsonSerializer.Serialize(v, options),
                v => JsonSerializer.Deserialize<List<AnsweredQuestion>>(v, options));
            
        modelBuilder.Entity<AnsweredQuestion>()
            .HasKey(aq => aq.Id);
        modelBuilder.Entity<User>()
            .HasKey(user => user.Nic);
        // Configure other entities as needed
    }
}