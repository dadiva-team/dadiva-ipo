using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace DadivaAPI.domain;

public class Token
{
    public string token { get; }
    
    public Token(string key, string issuer)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var sectoken = new JwtSecurityToken(issuer,
            issuer,
            null,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials);

        token =  new JwtSecurityTokenHandler().WriteToken(sectoken);
    }
}