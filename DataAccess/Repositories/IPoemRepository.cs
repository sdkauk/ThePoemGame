using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public interface IPoemRepository
    {
        Task AddLineToPoem(Guid poemId, Line line);
        Task CreatePoemAsync(Poem poem);
        Task<Poem> GetPoemAsync(Guid id);
        Task<List<Poem>> GetPoemsAsync(List<Guid> ids);
        Task UpdatePoemAsync(Poem poem);
    }
}