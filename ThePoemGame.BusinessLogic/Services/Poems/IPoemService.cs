using ThePoemGame.BusinessLogic.Services.Poems.Requests;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Poems
{
    public interface IPoemService
    {
        Task<Poem> AddLineToPoemAsync(LinePostRequest request, string userObjectId);
        Task<Poem> CreatePoemAsync(PoemPostRequest request, string userObjectId);
        Task<Poem> GetPoemAsync(Guid id);
    }
}