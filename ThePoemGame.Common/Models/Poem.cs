using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.Common.Models
{
    public class Poem
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public BasicUser Author { get; set; }
        public BasicUser NextContributor { get; set; }
        public List<Line> Lines { get; set; } = new List<Line>();
        public DateTime CreatedAt { get; set; }
        public DateTime FinishedAt { get; set; }
        public bool Completed { get; set; } = false;
    }
}
