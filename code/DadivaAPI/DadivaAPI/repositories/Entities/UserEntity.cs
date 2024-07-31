using System.ComponentModel.DataAnnotations;

namespace DadivaAPI.repositories.Entities;

public abstract class UserEntity
{
    [Key] [MinLength(8)] [MaxLength(8)] public required string Nic { get; set; }
    [MaxLength(256)] public required string Name { get; set; }
    [MaxLength(256)] public required string HashedPassword { get; set; }
    [MaxLength(256)] public required string Token { get; set; }
}