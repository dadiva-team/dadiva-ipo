namespace DadivaAPI.repositories.Entities;

public class AdminEntity : UserEntity
{
    public required List<TermsEntity> Terms { get; set; }
    public required List<FormEntity> Forms { get; set; }
}