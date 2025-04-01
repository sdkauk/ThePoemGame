using MongoDB.Driver;
using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public class PoemRepository : IPoemRepository
    {
        private readonly IMongoCollection<Poem> poems;
        public PoemRepository(IDbConnection db)
        {
            poems = db.PeomCollection;
        }
        public async Task<Poem> GetPoemAsync(Guid id)
        {
            var results = await poems.FindAsync(b => b.Id == id);
            return results.FirstOrDefault();
        }

        public async Task<List<Poem>> GetPoemsAsync(List<Guid> ids)
        {
            var filter = Builders<Poem>.Filter.In(p => p.Id, ids);
            var results = await poems.FindAsync(filter);
            return await results.ToListAsync();
        }

        public async Task CreatePoemAsync(Poem poem)
        {
            await poems.InsertOneAsync(poem);
        }

        public async Task UpdatePoemAsync(Poem poem)
        {
            var filter = Builders<Poem>.Filter.Eq("Id", poem.Id);
            await poems.ReplaceOneAsync(filter, poem, new ReplaceOptions { IsUpsert = true });
        }
        public async Task AddLineToPoem(Guid poemId, Line line)
        {
            var filter = Builders<Poem>.Filter.Eq(p => p.Id, poemId);
            var update = Builders<Poem>.Update.Push(p => p.Lines, line);
            await poems.UpdateOneAsync(filter, update);
        }

    }
}
