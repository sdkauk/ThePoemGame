using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> users;
        public UserRepository(IDbConnection db)
        {
            users = db.UserCollection;
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            var results = await users.FindAsync(_ => true);
            return results.ToList();
        }

        public async Task<User> GetUserAsync(Guid id)
        {
            var results = await users.FindAsync(u => u.Id == id);
            return results.FirstOrDefault();
        }

        public async Task<User> GetUserFromAuthenticationAsync(string objectId)
        {
            var results = await users.FindAsync(u => u.ObjectIdentifier == objectId);
            return results.FirstOrDefault();
        }

        public async Task CreateUserAsync(User user)
        {
            await users.InsertOneAsync(user);
        }

        public async Task UpdateUserAsync(User user)
        {
            var filter = Builders<User>.Filter.Eq("Id", user.Id);
            await users.ReplaceOneAsync(filter, user, new ReplaceOptions { IsUpsert = true });
        }

        public async Task AddGroupToUserAsync(Guid userId, BasicGroup group)
        {
            var filter = Builders<User>.Filter.Eq("Id", userId);
            var update = Builders<User>.Update.Push(u => u.Groups, group);
            await users.UpdateOneAsync(filter, update);
        }

        public async Task RemoveGroupFromUserAsync(Guid userId, BasicGroup group)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.PullFilter(u => u.Groups, g => g.Id == group.Id);
            var result = await users.UpdateOneAsync(filter, update);
        }

        public async Task AddGameToUserAsync(Guid userId, BasicGame game)
        {
            var filter = Builders<User>.Filter.Eq("Id", userId);
            var update = Builders<User>.Update.Push(u => u.Games, game);
            await users.UpdateOneAsync(filter, update);
        }

        public async Task RemoveGameFromUserAsync(Guid userId, BasicGame game)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            var update = Builders<User>.Update.PullFilter(u => u.Games, g => g.Id == game.Id);
            var result = await users.UpdateOneAsync(filter, update);
        }

    }
}
