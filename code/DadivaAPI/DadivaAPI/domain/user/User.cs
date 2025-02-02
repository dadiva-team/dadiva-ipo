using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using DadivaAPI.services.submissions.dtos;
using DadivaAPI.services.users.dtos;
using Isopoh.Cryptography.Argon2;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.domain.user;

public partial record User(
    string Nic,
    string Name,
    string HashedPassword,
    List<Role> Roles,
    string? Token = null,
    bool? IsVerified = null,
    DateTime? DateOfBirth = null,
    string? PlaceOfBirth = null)
{
    [GeneratedRegex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'"",.<>?/`~]).*$")]
    private static partial Regex PasswordRegex();

    public static bool IsValidPassword(string password)
    {
        return password.Length is >= 12 and <= 64 && PasswordRegex().IsMatch(password);
    }

    public static bool IsValidNic(string nic)
    {
        return nic.Length == 8 && nic.All(char.IsDigit);
    }

    public static string HashPassword(string password)
    {
        if (!IsValidPassword(password)) throw new ArgumentException("Invalid password");
        return Argon2.Hash(password);
    }

    public bool VerifyPassword(string password)
    {
        return Argon2.Verify(HashedPassword, password);
    }

    public string GenerateToken(string key, string issuer, string audience)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, Nic),
            new Claim("fullName", Name),
        };

        claims.AddRange(Roles.Select(role => new Claim(ClaimTypes.Role, role.ToString())));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                SecurityAlgorithms.HmacSha256Signature),
            Issuer = issuer,
            Audience = audience
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
    public UserWithNameExternalInfo ToUserWithNameExternalInfo()
    {
        return new UserWithNameExternalInfo(Name, Nic);
    }
    
    public static User CreateMinimalUser(MinimalUserDto minimalUserDto)
    {
        return new User(
            minimalUserDto.Nic,
            minimalUserDto.Name,
             "", // Default empty password or placeholder
             new List<Role>(), // Empty list of roles
             null, // No token
             null, // No verification status
             null, // No date of birth
             null // No place of birth
        );
    }
}