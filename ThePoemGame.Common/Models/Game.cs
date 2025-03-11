using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ThePoemGame.Common.Models
{
    public class Game
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        public string Name { get; set; } = "";

        public List<BasicUser> Players { get; set; } = new List<BasicUser>();

        public GameStatus Status { get; set; }

        public List<BasicPoem> Poems { get; set; } = new List<BasicPoem>();
        public int MaxPlayers { get; set; }
        public int LinesPerPoem { get; set; }
        public List<BasicUser> PlayerOrder { get; set; } = new List<BasicUser>();

    }

    public enum GameStatus
    {
        WaitingForPlayers,
        InProgress,
        Completed,
        Cancelled
    }
}
