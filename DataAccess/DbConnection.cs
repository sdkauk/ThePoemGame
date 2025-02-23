using MongoDB.Driver;
using Microsoft.Extensions.Configuration;

namespace ThePoemGame.DataAccess
{
    public class DbConnection : IDbConnection
    {
        private readonly IConfiguration configuration;
        private readonly IMongoDatabase db;
        private string connectionId = "MongoDB";
        public string DbName { get; private set; }

        public MongoClient Client { get; private set; }

        public DbConnection(IConfiguration configuration)
        {
            this.configuration = configuration;
            Client = new MongoClient(configuration.GetConnectionString(connectionId));
            DbName = configuration["DatabaseName"];
            db = Client.GetDatabase(DbName);
        }

    }
}
