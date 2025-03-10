using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.Common.Models
{
    public class BasicGame
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public string Name { get; set; }

        public BasicGame()
        {

        }

        public BasicGame(Game g)
        {
            Id = g.Id;
            Name = g.Name;
        }
    }
}
