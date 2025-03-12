using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public interface IGameRepository
    {
        Task CreateGameAsync(Game game);
        Task DeleteGameAsync(Guid id);
        Task<List<Game>> GetAllGamesAsync();
        Task<Game> GetGameAsync(Guid id);
        Task UpdateGameAsync(Game game);
        Task<Game> GetGameByInviteCodeAsync(string inviteCode);
        Task AddUserToGameAsync(Guid gameId, BasicUser user);
        Task RemoveUserFromGameAsync(Guid gameId, BasicUser user);
        Task<List<Game>> GetGamesByUserAsync(Guid userId);
    }
}