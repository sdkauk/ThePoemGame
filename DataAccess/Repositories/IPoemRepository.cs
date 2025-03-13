using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public interface IPoemRepository
    {
        Task AddLineToPoem(Guid poemId, Line line);
        Task CreatePoemAsync(Poem poem);
        Task<Poem> GetPoemAsync(Guid id);
        Task UpdatePoemAsync(Poem poem);
    }
}