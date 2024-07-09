using System.Data.OleDb;

namespace DadivaAPI.repositories.medications
{
    public class MedicationsRepository : IMedicationsRepository
    {
        string connectionString =
            "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=Database11.accdb;";

        public async Task<List<string>> SearchMedications(string query)
        {
            Console.WriteLine("Searching for: " + query);
            var list = new List<string>();

            try
            {
                // Create the connection object
                await using var connection = new OleDbConnection(connectionString);
                // Open the connection
                await connection.OpenAsync();
                Console.WriteLine("Connection opened successfully.");

                // Create a command object
                await using var command = connection.CreateCommand();
                command.CommandText = "SELECT [NOME] as texto FROM [PRODUTO] WHERE [NOME] LIKE '" + query + "%'";
                // Execute the command and read the results
                await using var reader = await command.ExecuteReaderAsync();

                // Check if there are results
                if (reader.HasRows)
                {
                    // Read each row
                    while (await reader.ReadAsync())
                    {
                        list.Add(reader.GetString(0));
                    }
                }
                else
                {
                    await Console.Out.WriteLineAsync("No rows found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }

            return list;
        }

        public async Task<List<string>> GetCfts(string productName)
        {
            var list = new List<string>();

            try
            {
                // Create the connection object
                await using var connection = new OleDbConnection(connectionString);
                // Open the connection
                await connection.OpenAsync();
                Console.WriteLine("Connection opened successfully.");

                // Create a command object
                await using var command = connection.CreateCommand();
                command.CommandText =
                    "SELECT c.DESCR FROM (PRODUTO AS p INNER JOIN LNK_PROD_CFT AS l ON p.PROD_ID = l.PROD_ID) INNER JOIN REF_CFT AS c ON l.CFT_COD = c.CFT_COD WHERE p.NOME = '" +
                    productName + "';";
                // Execute the command and read the results
                await using var reader = await command.ExecuteReaderAsync();

                // Check if there are results
                if (reader.HasRows)
                {
                    // Read each row
                    while (await reader.ReadAsync())
                    {
                        list.Add(reader.GetString(0));
                    }
                }
                else
                {
                    await Console.Out.WriteLineAsync("No rows found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }

            return list;
        }
    }
}