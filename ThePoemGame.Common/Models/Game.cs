using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ThePoemGame.Common.Models
{
    public class Game
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonRepresentation(BsonType.String)]
        public Guid GroupId { get; set; }

        public string Name { get; set; } = "";

        public List<BasicUser> Players { get; set; } = new List<BasicUser>();

        public GameStatus Status { get; set; }
        public GamePhase Phase { get; set; }

        public List<BasicPoem> Poems { get; set; } = new List<BasicPoem>();
        public int MaxPlayers { get; set; }
        public int LinesPerPoem { get; set; }
        public List<BasicUser> PlayerOrder { get; set; } = new List<BasicUser>();
        public string InviteCode { get; set; }
    }

    public enum GameStatus
    {
        WaitingForPlayers,
        InProgress,
        Completed,
        Cancelled
    }

    public enum GamePhase
    {
        CreatePoems,
        RoundRobin,
        Exhibit,
        Awards
    }
}
