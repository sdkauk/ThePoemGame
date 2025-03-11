using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public interface IUserRepository
    {
        Task CreateUserAsync(User user);
        Task<List<User>> GetAllUsersAsync();
        Task<User> GetUserAsync(Guid id);
        Task<User> GetUserFromAuthenticationAsync(string objectId);
        Task UpdateUserAsync(User user);
        Task AddGroupToUserAsync(Guid userId, BasicGroup group);
        Task RemoveGroupFromUserAsync(Guid userId, BasicGroup group);
        Task AddGameToUserAsync(Guid userId, BasicGame game);
        Task RemoveGameFromUserAsync(Guid userId, BasicGame game);
    }
}