using DadivaAPI.repositories;
using DadivaAPI.repositories.form;
using Microsoft.EntityFrameworkCore;

namespace DadivaAPI.utils;

public class PopulateDatabase
{
    public static void Initialize(DadivaDbContext context)
    {
        // Check if the table is not empty
        if (context.Forms.Any()) return;
        
        // Insert initial data
        context.Users.AddRange(InitialData.Users);
        context.Forms.Add(InitialData.Form);
        context.UserAccountStatuses.AddRange(InitialData.UserAccountStatuses);

        context.SaveChanges();
    }
}