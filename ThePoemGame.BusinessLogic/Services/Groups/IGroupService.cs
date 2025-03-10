using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Groups
{
    public interface IGroupService
    {
        Task<Group> GetGroupAsync(Guid id);
        Task<Group> CreateGroupAsync(string name, string userObjectId);
        Task<List<Group>> GetGroupsByUserAsync(string userObjectId);
    }
}