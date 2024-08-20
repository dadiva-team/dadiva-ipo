namespace DadivaAPI.routes.users.models;

public record CreateUserInputModel(
    string Nic,
    string Name,
    string Password,
    List<string> Roles,
    bool? IsVerified = null,
    DateTime? DateOfBirth = null,
    string? PlaceOfBirth = null);