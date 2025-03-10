using MongoDB.Driver;
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

        public async Task CreateGameAsync(Game game)
        {
            await games.InsertOneAsync(game);
        }

        public async Task UpdateGameAsync(Game game)
        {
            var filter = Builders<Game>.Filter.Eq("Id", game.Id);
            await games.ReplaceOneAsync(filter, game, new ReplaceOptions { IsUpsert = true });
        }

        public async Task DeleteGameAsync(Guid id)
        {
            var filter = Builders<Game>.Filter.Eq("Id", id);
            await games.DeleteOneAsync(filter);
        }
    }
}
