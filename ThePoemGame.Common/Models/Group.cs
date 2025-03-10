using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.Common.Models
{
    public class Group
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string InviteCode { get; set; }
        public List<BasicUser> Members { get; set; }
        public List<BasicGame> Games { get; set; }
    }
}
