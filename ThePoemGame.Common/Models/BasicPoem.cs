using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ThePoemGame.Common.Models;

namespace ThePoemGame.Common.Models
{
    public class BasicPoem
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public BasicUser Author { get; set; }
        public BasicUser? NextContributor { get; set; }
        public bool Completed { get; set; } = false;
        public int LineCount { get; set; }

        public BasicPoem()
        {

        }

        public BasicPoem(Poem p)
        {
            Id = p.Id;
            Title = p.Title;
            Author = p.Author;
            NextContributor = p.NextContributor;
            Completed = p.Completed;
            LineCount = p.Lines.Count;
        }
    }
}
