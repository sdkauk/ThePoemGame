using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ThePoemGame.Common.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public required string ObjectIdentifier { get; set; }
        public required string Email { get; set; }
        public required string DisplayName { get; set; }
        public List<BasicGroup> Groups { get; set; } = new List<BasicGroup>();
        public List<BasicGame> Games { get; set; } = new List<BasicGame>();
        public List<BasicPoem> PoemsWaiting { get; set; } = new List<BasicPoem>();
    }
}