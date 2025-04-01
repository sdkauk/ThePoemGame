using ThePoemGame.BusinessLogic.Services.Poems.Requests;
using ThePoemGame.BusinessLogic.Services.Poems.Responses;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Poems
{
    public interface IPoemService
    {
        Task<Poem> AddLineToPoemAsync(LinePostRequest request, string userObjectId);
        Task<Poem> CreatePoemAsync(PoemPostRequest request, string userObjectId);
        Task<Poem> GetPoemAsync(Guid id);
        Task<List<Poem>> GetPoemsAsync(List<Guid> ids);
        Task<List<WaitingPoemResponse>> GetPoemsWaitingForUserAsync(string userObjectId);
    }
}