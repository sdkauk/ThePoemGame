namespace ThePoemGame.BusinessLogic.Services.Games.Requests
{
    public class GamePostRequest
    {
        public int MaxPlayers { get; set; } 
        public int LinesPerPoem { get; set; }
        public Guid GroupId { get; set; }
    }
}
