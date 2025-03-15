using MongoDB.Driver;
using SharpCompress.Common;
using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly IMongoCollection<Group> groups;
        public GroupRepository(IDbConnection db)
        {
            groups = db.GroupCollection;
        }

        public async Task<List<Group>> GetAllGroupsAsync()
        {
            var results = await groups.FindAsync(_ => true);
            return results.ToList();
        }

        public async Task<Group> GetGroupAsync(Guid id)
        {
            var results = await groups.FindAsync(b => b.Id == id);
            return results.FirstOrDefault();
        }

        public async Task<List<Group>> GetGroupsByUserAsync(Guid userId)
        {
            var filter = Builders<Group>.Filter.ElemMatch(g => g.Members, m => m.Id == userId);
            var results = await groups.FindAsync(filter);
            return await results.ToListAsync();
        }
        public async Task<Group> GetGroupByInviteCodeAsync(string inviteCode)
        {
            if (string.IsNullOrWhiteSpace(inviteCode))
                throw new ArgumentException("Invite code cannot be empty", nameof(inviteCode));

            var filter = Builders<Group>.Filter.Eq(g => g.InviteCode, inviteCode);
            var result = await groups.FindAsync(filter);
            return await result.FirstOrDefaultAsync();
        }

        public async Task CreateGroupAsync(Group group)
        {
            await groups.InsertOneAsync(group);
        }

        public async Task UpdateGroupAsync(Group group)
        {
            var filter = Builders<Group>.Filter.Eq("Id", group.Id);
            await groups.ReplaceOneAsync(filter, group, new ReplaceOptions { IsUpsert = true });
        }

        public async Task AddUserToGroupAsync(Guid groupId, BasicUser user)
        {
            var filter = Builders<Group>.Filter.Eq(g => g.Id, groupId);
            var update = Builders<Group>.Update.Push(g => g.Members, user);
            var result = await groups.UpdateOneAsync(filter, update);
        }

        public async Task RemoveUserFromGroupAsync(Guid groupId, BasicUser user)
        { 
            var filter = Builders<Group>.Filter.Eq(g => g.Id, groupId);
            var update = Builders<Group>.Update.PullFilter(g => g.Members, m => m.Id == user.Id);
            var result = await groups.UpdateOneAsync(filter, update);
        }
        public async Task AddGameToGroupAsync(Guid groupId, BasicGame game)
        {
            var filter = Builders<Group>.Filter.Eq(g => g.Id, groupId);
            var update = Builders<Group>.Update.Push(g => g.Games, game);
            var result = await groups.UpdateOneAsync(filter, update);
        }

        public async Task RemoveGameFromGroupAsync(Guid groupId, BasicGame game)
        {
            var filter = Builders<Group>.Filter.Eq(g => g.Id, groupId);
            var update = Builders<Group>.Update.PullFilter(g => g.Games, ga => ga.Id == game.Id);
            var result = await groups.UpdateOneAsync(filter, update);
        }


        public async Task DeleteGroupAsync(Guid id)
        {
            var filter = Builders<Group>.Filter.Eq("Id", id);
            await groups.DeleteOneAsync(filter);
        }

        public async Task<bool> IsInviteCodeUniqueAsync(string code)
        {
            var filter = Builders<Group>.Filter.Eq(g => g.InviteCode, code);
            long count = await groups.CountDocumentsAsync(filter);
            return count == 0;
        }
    }
}
