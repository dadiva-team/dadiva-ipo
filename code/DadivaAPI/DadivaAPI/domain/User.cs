namespace DadivaAPI.domain;

public class User
{
    public int nic { get; set; }
    public string password { get; set; }
    
    public static bool IsValidPassword(string password)
    {
        return password.Length >= 8;
        //return password.Length >= 8 && password.Any(char.IsDigit) && password.Any(char.IsUpper) && password.Any(char.IsLower);
    }

    public static bool IsValidNic(int nic)
    {
        return nic.ToString().Length == 8;
    }
    
    //public static string HashPassword()
}