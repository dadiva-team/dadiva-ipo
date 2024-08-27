using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using DadivaAPI.domain;

namespace DadivaAPI.repositories.Entities;

public abstract  class AnswerEntity
{
    public int Id { get; set; }
    public abstract IAnswer ToDomain();
}