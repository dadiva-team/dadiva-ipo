using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.domain;

public class Token
{
    public string token { get; }
    
    public Token(string key, string issuer, string audience, User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var sectoken = new JwtSecurityToken(
            issuer,
            audience,
            new []
            {
                new Claim(ClaimTypes.Sid, user.Nic.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim("roles", [""])
            },
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials);

        token =  new JwtSecurityTokenHandler().WriteToken(sectoken);
    }
}