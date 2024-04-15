using DadivaAPI.domain;

namespace DadivaAPI.services.form.dtos;

public record FormExternalInfo(List<Question> Questions, List<Rule> Rules);