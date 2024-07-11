using DadivaAPI.domain;
using DadivaAPI.repositories;

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
        context.UserAccountStatus.AddRange(InitialData.UserAccountStatuses);


        context.CftToManual.AddRange(InitialData.CftToManualEntries.Select(entry => new CftToManualEntry
        {
            Cft = entry.Key,
            ManualEntry = entry.Value
        }));


        context.SaveChanges();
    }
}