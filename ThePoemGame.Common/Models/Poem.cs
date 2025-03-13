using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ThePoemGame.Common.Models
{
    public class Poem
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required BasicUser Author { get; set; }
        public BasicUser? NextContributor { get; set; } 
        public List<Line> Lines { get; set; } = new List<Line>();
        public DateTime CreatedAt { get; set; }
        public DateTime FinishedAt { get; set; }
        public bool Completed { get; set; } = false;
    }
}
