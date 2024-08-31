namespace DadivaAPI.routes.form.models
{
    public class ReviewSubmissionRequest
    {
        public Boolean Status { get; set; }
        public string? FinalNote { get; set; }
        public List<NoteModel> Notes { get; set; }
    }

    public class NoteModel
    {
        public string QuestionId { get; set; }
        public string? NoteText { get; set; }
    }
}