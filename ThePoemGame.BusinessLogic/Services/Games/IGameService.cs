using ThePoemGame.BusinessLogic.Services.Games.Requests;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Games
{
    public interface IGameService
    {
        Task<Game> CreateGameAsync(GamePostRequest request, string userObjectId);
        Task<List<Game>> GetGamesByUserAsync(string userObjectId);
        Task<Game> GetGroupAsync(Guid id);
    }
}