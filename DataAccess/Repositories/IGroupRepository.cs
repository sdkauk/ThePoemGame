using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public interface IGroupRepository
    {
        Task CreateGroupAsync(Group group);
        Task DeleteGroupAsync(Guid id);
        Task<List<Group>> GetAllGroupsAsync();
        Task<Group> GetGroupAsync(Guid id);
        Task<Group> GetGroupByInviteCodeAsync(string inviteCode);
        Task<List<Group>> GetGroupsByUserAsync(Guid userId);
        Task UpdateGroupAsync(Group group);
        Task AddUserToGroupAsync(Guid groupId, BasicUser user);
        Task RemoveUserFromGroupAsync(Guid groupId, BasicUser user);
        Task<bool> IsInviteCodeUniqueAsync(string code);
        Task AddGameToGroupAsync(Guid groupId, BasicGame game);
        Task RemoveGameFromGroupAsync(Guid groupId, BasicGame game);
    }
}