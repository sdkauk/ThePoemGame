using ThePoemGame.BusinessLogic.Services.Users.Requests;
using ThePoemGame.Common.Models;
using ThePoemGame.DataAccess.Repositories;

namespace ThePoemGame.BusinessLogic.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly IGroupRepository groupRepository;
        private readonly IGameRepository gameRepository;

        public UserService(IUserRepository userRepository, IGroupRepository groupRepository, IGameRepository gameRepository)
        {
            this.userRepository = userRepository;
            this.groupRepository = groupRepository;
            this.gameRepository = gameRepository;
        }

        public async Task<User> GetCurrentUserAsync(string objectId)
        {
            return await userRepository.GetUserFromAuthenticationAsync(objectId);
        }

        public async Task<User> CreateUserAsync(UserPostRequest request)
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                ObjectIdentifier = request.ObjectIdentifier,
                Email = request.Email,
                DisplayName = request.DisplayName,
                Groups = new List<BasicGroup>(),
                Games = new List<BasicGame>(),
            };

            await userRepository.CreateUserAsync(user);
            return user;
        }

        //TODO: Add errors to validation
        public async Task<bool> AddUserToGroupAsync(AddUserToGroupRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserObjectId))
            {
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.InviteCode))
            {
                return false;
            }
            var user = await userRepository.GetUserFromAuthenticationAsync(request.UserObjectId);

            if (user == null) { throw new Exception("User not found"); }

            var group = await groupRepository.GetGroupByInviteCodeAsync(request.InviteCode);

            if (group == null)
                return false; //TODO: Change the return to communicate that there is no group with that code.

            if (group.Members.Any(m => m.Id == user.Id))
                return true; //TODO: Change the return to communicate that the user was already in the group.

            //TODO Make these a transaction
            await groupRepository.AddUserToGroupAsync(group.Id, new BasicUser(user));
            await userRepository.AddGroupToUserAsync(user.Id, new BasicGroup(group));

            return true;
        }

        public async Task<bool> RemoveUserFromGroupAsync(RemoveUserFromGroupRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserObjectId))
            {
                return false;
            }
            if (request.GroupId == Guid.Empty)
            {
                return false;
            }
            var user = await userRepository.GetUserFromAuthenticationAsync(request.UserObjectId);

            if (user == null) { throw new Exception("User not found"); }

            var group = await groupRepository.GetGroupAsync(request.GroupId);

            if (group == null) { throw new Exception("Group not found"); }

            if (!group.Members.Any(m => m.Id == user.Id))
                return true; //TODO: Change the return to communicate that the user was already in the group.

            //TODO Make these a transaction
            await groupRepository.RemoveUserFromGroupAsync(group.Id, new BasicUser(user));
            await userRepository.RemoveGroupFromUserAsync(user.Id, new BasicGroup(group));

            return true;
        }

        //TODO: Add errors to validation
        public async Task<bool> AddUserToGameAsync(AddUserToGameRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserObjectId))
            {
                return false;
            }
            if (string.IsNullOrWhiteSpace(request.InviteCode) && request.GameId == Guid.Empty)
            {
                return false;
            }
            var user = await userRepository.GetUserFromAuthenticationAsync(request.UserObjectId);

            if (user == null) { throw new Exception("User not found"); }

            var game = request.InviteCode != null
                ? await gameRepository.GetGameByInviteCodeAsync(request.InviteCode)
                : (request.GameId != null && request.GameId != Guid.Empty
                    ? await gameRepository.GetGameAsync(request.GameId.Value)
                    : null);

            if (game == null)
                return false; //TODO: Change the return to communicate that there is no game with that code.

            if (game.Players.Any(m => m.Id == user.Id))
                return true; //TODO: Change the return to communicate that the user was already in the game.

            //TODO Make these a transaction
            await gameRepository.AddUserToGameAsync(game.Id, new BasicUser(user));
            await userRepository.AddGameToUserAsync(user.Id, new BasicGame(game));

            return true;
        }

        public async Task<bool> RemoveUserFromGameAsync(RemoveUserFromGameRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UserObjectId))
            {
                return false;
            }
            if (request.GameId == Guid.Empty)
            {
                return false;
            }
            var user = await userRepository.GetUserFromAuthenticationAsync(request.UserObjectId);

            if (user == null) { throw new Exception("User not found"); }

            var game = await gameRepository.GetGameAsync(request.GameId);

            if (game == null) { throw new Exception("Game not found"); }

            if (!game.Players.Any(m => m.Id == user.Id))
                return true; //TODO: Change the return to communicate that the user was already in the group.

            //TODO Make these a transaction
            await gameRepository.RemoveUserFromGameAsync(game.Id, new BasicUser(user));
            await userRepository.RemoveGameFromUserAsync(user.Id, new BasicGame(game));

            return true;
        }
    }
}

