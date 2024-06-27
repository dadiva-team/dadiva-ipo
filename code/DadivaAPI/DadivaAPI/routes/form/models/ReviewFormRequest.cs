namespace DadivaAPI.routes.form.models
{
    public class ReviewFormRequest
    {
        public int DoctorNic { get; set; }
        public string Status { get; set; }
        public string? FinalNote { get; set; }
        public List<NoteModel> Notes { get; set; }
    }

    public class NoteModel
    {
        public string QuestionId { get; set; }
        public string? NoteText { get; set; }
    }
}