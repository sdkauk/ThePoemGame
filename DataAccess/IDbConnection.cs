using MongoDB.Driver;
using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess
{
    public interface IDbConnection
    {
        MongoClient Client { get; }
        string DbName { get; }
        IMongoCollection<Game> GameCollection { get; }
        string GameNameCollection { get; }
        IMongoCollection<Group> GroupCollection { get; }
        string GroupNameCollection { get; }
        IMongoCollection<User> UserCollection { get; }
        string UserCollectionName { get; }
    }
}