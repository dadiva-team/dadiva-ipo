using DadivaAPI.domain;
using DadivaAPI.repositories;
using DadivaAPI.repositories.Entities;

namespace DadivaAPI.utils;

public static class PopulateDatabase
{
    public static void Initialize(DadivaDbContext context)
    {
        // Check if the table is not empty
        if (context.Forms.Any()) return;

        // Insert initial data
        context.Users.AddRange(InitialData.Users);
        context.Forms.Add(InitialData.Form);
        context.Terms.AddRange(InitialData.Terms);
        context.Inconsistencies.Add(InitialData.Inconsistencies);

        // ANTICOAGULANTES
        var antiCoagEntry = new ManualEntryEntity
        {
            Name = "Anticoagulantes",
            EntryExamples = []
        };
        var heparineExample1 = new EntryExampleEntity
        {
            ManualEntry = antiCoagEntry,
            Text = "Heparina",
            Criterias = []
        };

        var heparineCriteria1_1 = new CriteriaEntity
        {
            EntryExample = heparineExample1,
            Text =
                "<p>Avaliar causa da prescrição.</p><p style=\"color:orange;\">Suspensão Temporária de 3 dias após a última administração</p>"
        };
        
        var heparineExample2 = new EntryExampleEntity
        {
            ManualEntry = antiCoagEntry,
            Text = "Antagonistas da Vitamina K - Varfarina Varfine\u00ae, Acenocumarol, Sntrom\u00ae; ....",
            Criterias = []
        };

        var heparineCriteria2_1 = new CriteriaEntity
        {
            EntryExample = heparineExample2,
            Text =
                "<p>Se tratamento temporário e completo - </p><p style=\"color:orange;\">Suspensão Temporária de 7 dias após a última toma</p>"
        };
        
        var heparineCriteria2_2 = new CriteriaEntity
        {
            EntryExample = heparineExample2,
            Text =
                "<p>Avaliar a doença de base que poderá ser motivo de <span style=\"color:red;\">Suspensão Definitiva</span></p>"
        };

        context.Cfts.Add(new CftEntity
        {
            Name = "Outros anticoagulantes",
            ManualEntry = antiCoagEntry
        });

        
        var painKEntry = new ManualEntryEntity
        {
            Name = "Analgésicos",
            EntryExamples = []
        };
        
        var normalExample = new EntryExampleEntity
        {
            ManualEntry = painKEntry,
            Text = "Paracetamol, Ben U Ron \u00ae, Tramadol, Tramal\u00ae, Zaldiar\u00ae",
            Criterias = []
        };
        
        var normalCriteria = new CriteriaEntity
        {
            EntryExample = normalExample,
            Text = "<p>Avaliar a doença de base, pois não contraindicam a dádiva - <span style=\"color:green\">Apto</span></p>"
        };
        
        normalExample.Criterias.Add(normalCriteria);
        
        var opioidExample = new EntryExampleEntity
        {
            ManualEntry = painKEntry,
            Text = "Analgésicos Opioides",
            Criterias = []
        };
        
        var opioidCriteria = new CriteriaEntity
        {
            EntryExample = opioidExample,
            Text = "<p>Critério clinico - <span style=\"color:orange\">Suspensão Temporária</span></p>"
        };
        
        opioidExample.Criterias.Add(opioidCriteria);
        
        painKEntry.EntryExamples.Add(normalExample);
        painKEntry.EntryExamples.Add(opioidExample);
        
        context.ManualEntries.Add(painKEntry);
        
        context.Cfts.Add(new CftEntity
        {
            Name = "Analgésicos e antipiréticos",
            ManualEntry = painKEntry
        });
        
        heparineExample1.Criterias.Add(heparineCriteria1_1);
        
        heparineExample2.Criterias.Add(heparineCriteria2_1);
        heparineExample2.Criterias.Add(heparineCriteria2_2);
        
        antiCoagEntry.EntryExamples.Add(heparineExample1);
        antiCoagEntry.EntryExamples.Add(heparineExample2);
        
        context.ManualEntries.Add(antiCoagEntry);
        
        context.SaveChanges();

        /* context.TermsChangeLogs.Add(InitialData.TestTermsChangeLog);
         context.UserAccountStatus.AddRange(InitialData.UserAccountStatuses); */

        context.SaveChanges();
    }
}