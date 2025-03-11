using ThePoemGame.Common.Models;
using ThePoemGame.DataAccess.Repositories;

namespace ThePoemGame.BusinessLogic.Services.Groups
{
    public class GroupService : IGroupService
    {
        private readonly IGroupRepository groupRepository;
        private readonly IUserRepository userRepository;

        public GroupService(IGroupRepository groupRepository, IUserRepository userRepository)
        {
            this.groupRepository = groupRepository;
            this.userRepository = userRepository;
        }

        public async Task<List<Group>> GetGroupsByUserAsync(string userObjectId)
        {
            var user = await userRepository.GetUserFromAuthenticationAsync(userObjectId);
            return await groupRepository.GetGroupsByUserAsync(user.Id);
        }

        public async Task<Group> GetGroupAsync(Guid id)
        {
            return await groupRepository.GetGroupAsync(id);
        }

        public async Task<Group> CreateGroupAsync(string name, string userObjectId)
        {
            var user = new BasicUser(await userRepository.GetUserFromAuthenticationAsync(userObjectId));
            if (user == null)
            {
                throw new Exception("User not found");
            }
            var group = new Group
            {
                Id = Guid.NewGuid(),
                Name = name,
                InviteCode = await GenerateInviteCodeAsync(),
                Members = new List<BasicUser> { user },
                Games = new List<BasicGame>()
            };

            await groupRepository.CreateGroupAsync(group);
            await userRepository.AddGroupToUserAsync(user.Id, new BasicGroup(group));

            return group;
        }

        private async Task<string> GenerateInviteCodeAsync()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const int codeLength = 6; //TODO: This should be in some sort of config.

            for (int length = codeLength; length <= 10; length++)
            {
                for (int attempt = 0; attempt < 3; attempt++)
                {
                    var random = new Random();
                    string code = new string(Enumerable.Repeat(chars, length)
                        .Select(s => s[random.Next(s.Length)]).ToArray());

                    bool isUnique = await groupRepository.IsInviteCodeUniqueAsync(code);
                    if (isUnique)
                        return code;
                }
            }

            // Last resort: use a full GUID but formatted to be somewhat user-friendly
            string guidCode = Guid.NewGuid().ToString().Replace("-", "").Substring(0, 10).ToUpper();
            return guidCode;
        }
    }
}
