using MongoDB.Driver;
using System.Text.RegularExpressions;
using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public class GameRepository : IGameRepository
    {

        private readonly IMongoCollection<Game> games;
        public GameRepository(IDbConnection db)
        {
            games = db.GameCollection;
        }

        public async Task<List<Game>> GetAllGamesAsync()
        {
            var results = await games.FindAsync(_ => true);
            return results.ToList();
        }

        public async Task<Game> GetGameAsync(Guid id)
        {
            var results = await games.FindAsync(b => b.Id == id);
            return results.FirstOrDefault();
        }

        public async Task<List<Game>> GetGamesByUserAsync(Guid userId)
        {
            var filter = Builders<Game>.Filter.ElemMatch(g => g.Players, p => p.Id == userId);
            var results = await games.FindAsync(filter);
            return await results.ToListAsync();
        }

        public async Task<Game> GetGameByInviteCodeAsync(string inviteCode)
        {
            if (string.IsNullOrWhiteSpace(inviteCode))
                throw new ArgumentException("Invite code cannot be empty", nameof(inviteCode));

            var filter = Builders<Game>.Filter.Eq(g => g.InviteCode, inviteCode);
            var result = await games.FindAsync(filter);
            return await result.FirstOrDefaultAsync();
        }

        public async Task CreateGameAsync(Game game)
        {
            await games.InsertOneAsync(game);
        }

        public async Task UpdateGameAsync(Game game)
        {
            var filter = Builders<Game>.Filter.Eq("Id", game.Id);
            await games.ReplaceOneAsync(filter, game, new ReplaceOptions { IsUpsert = true });
        }

        public async Task AddUserToGameAsync(Guid gameId, BasicUser user)
        {
            var filter = Builders<Game>.Filter.Eq(g => g.Id, gameId);
            var update = Builders<Game>.Update.Push(g => g.Players, user);
            var result = await games.UpdateOneAsync(filter, update);
        }

        public async Task RemoveUserFromGameAsync(Guid gameId, BasicUser user)
        {
            var filter = Builders<Game>.Filter.Eq(g => g.Id, gameId);
            var update = Builders<Game>.Update.PullFilter(g => g.Players, m => m.Id == user.Id);
            var result = await games.UpdateOneAsync(filter, update);
        }

        public async Task AddPoemToGame(Guid gameId, BasicPoem poem)
        {
            var filter = Builders<Game>.Filter.Eq(g => g.Id, gameId);
            var update = Builders<Game>.Update.Push(g => g.Poems, poem);
            var result = await games.UpdateOneAsync(filter, update);
        }

        public async Task DeleteGameAsync(Guid id)
        {
            var filter = Builders<Game>.Filter.Eq("Id", id);
            await games.DeleteOneAsync(filter);
        }
    }
}
