namespace DadivaAPI.domain;

public record User(int Nic, string Name, string HashedPassword, Role Role)
{
    public static bool IsValidPassword(string password)
    {
        return password.Length >= 8;
        //return password.Length >= 8 && password.Any(char.IsDigit) && password.Any(char.IsUpper) && password.Any(char.IsLower);
    }

    public static bool IsValidNic(int nic)
    {
        return nic.ToString().Length == 8;
    }

    public static string HashPassword(string password)
    {
        //TODO: TEMPORARY FAKE HASHING
        return $"{password}hashed";
    }
}