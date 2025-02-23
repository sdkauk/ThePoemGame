using MongoDB.Driver;

namespace ThePoemGame.DataAccess
{
    public interface IDbConnection
    {
        MongoClient Client { get; }
    }
}