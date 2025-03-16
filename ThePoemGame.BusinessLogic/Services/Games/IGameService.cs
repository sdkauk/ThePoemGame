using ThePoemGame.BusinessLogic.Services.Games.Requests;
using ThePoemGame.BusinessLogic.Services.Games.Responses;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Games
{
    public interface IGameService
    {
        Task<Game> CreateGameAsync(GamePostRequest request, string userObjectId);
        Task<List<Game>> GetGamesByUserAsync(string userObjectId);
        Task<GameResponse> GetGameAsync(Guid id, string userObjectId);
        Task PassPoemToNextPlayer(Guid poemId, Guid gameId, string? userObjectId, Guid? userId);
        Task<bool> MoveToRoundRobinPhase(Guid gameId);
        Task<Game> StartGameAsync(Guid gameId);
        Task<List<Game>> GetGamesByGroupAsync(Guid groupId);
        Task<bool> IsUserInGameAsync(Guid gameId, string userObjectId);
    }
}