namespace DadivaAPI.routes.form.models
{
    public record GetInconsistenciesOutputModel(List<RuleWithReason> Inconsistencies);

    public class RuleWithReason
    {
        public RuleModel Rule { get; set; }
        public string Reason { get; set; }
        
    }
}