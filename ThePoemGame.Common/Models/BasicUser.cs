using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ThePoemGame.Common.Models
{
    public class BasicUser
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public string Name { get; set; }

        public BasicUser()
        {

        }

        public BasicUser(User e)
        {
            Id = e.Id;
            Name = e.DisplayName;
        }
    }
}