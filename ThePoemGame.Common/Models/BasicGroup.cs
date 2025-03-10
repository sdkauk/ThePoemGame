using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ThePoemGame.Common.Models
{
    public class BasicGroup
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string InviteCode { get; set; }

        public BasicGroup()
        {

        }

        public BasicGroup(Group g)
        {
            Id = g.Id;
            Name = g.Name;
            InviteCode = g.InviteCode;
        }

    }
}
