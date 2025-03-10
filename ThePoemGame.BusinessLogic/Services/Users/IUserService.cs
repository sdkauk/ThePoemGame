using ThePoemGame.BusinessLogic.Services.Users.Requests;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Users
{
    public interface IUserService
    {
        Task<bool> AddUserToGroupAsync(AddUserToGroupRequest request);
        Task<bool> RemoveUserFromGroupAsync(RemoveUserFromGroupRequest request);
        Task<User> CreateUserAsync(UserPostRequest request);
        Task<User> GetCurrentUserAsync(string objectId);

    }
}