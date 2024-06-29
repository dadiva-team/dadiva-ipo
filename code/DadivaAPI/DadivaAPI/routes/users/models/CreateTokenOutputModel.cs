using DadivaAPI.domain;

namespace DadivaAPI.routes.users.models;

public record CreateTokenOutputModel(int Nic, string Token, UserAccountStatus AccountStatus);
