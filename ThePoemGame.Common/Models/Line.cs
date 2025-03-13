using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.Common.Models
{
    public class Line
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public required BasicUser Author { get; set; }
        public required string Content { get; set; }
        public int LineNumber { get; set; }
        public int Kudos { get; set; }
        public LineType LineType { get; set; }
    }

    public enum LineType
    {
        Call,
        Response
    }
}
