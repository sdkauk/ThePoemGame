using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ThePoemGame.Common.Models
{
    public class Game
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        public string Name { get; set; }

        public List<BasicUser> Players { get; set; }
    }
}
