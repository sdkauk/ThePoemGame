using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using ThePoemGame.Common;
using ThePoemGame.Common.Models;

namespace ThePoemGame.DataAccess
{
    public class DbConnection : IDbConnection
    {
        private readonly IConfiguration configuration;
        private readonly IMongoDatabase db;
        private string connectionId = "MongoDB";
        public string DbName { get; private set; }

        public string GroupNameCollection { get; private set; } = "groups";
        public string GameNameCollection { get; private set; } = "games";
        public string UserCollectionName { get; private set; } = "users";

        public MongoClient Client { get; private set; }

        public IMongoCollection<Group> GroupCollection { get; private set; }
        public IMongoCollection<Game> GameCollection { get; private set; }
        public IMongoCollection<User> UserCollection { get; private set; }

        public DbConnection(IConfiguration configuration)
        {
            this.configuration = configuration;
            Client = new MongoClient(configuration.GetConnectionString(connectionId));
            DbName = configuration["DatabaseName"];
            db = Client.GetDatabase(DbName);

            GroupCollection = db.GetCollection<Group>(GroupNameCollection);
            GameCollection = db.GetCollection<Game>(GameNameCollection);
            UserCollection = db.GetCollection<User>(UserCollectionName);
        }

    }
}
