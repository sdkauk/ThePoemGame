using ThePoemGame.DataAccess.DataSeeder;
using ThePoemGame.DataAccess.Repositories;
using ThePoemGame.BusinessLogic.Services.Groups;
using ThePoemGame.BusinessLogic.Services.Claims;
using ThePoemGame.DataAccess;
using ThePoemGame.BusinessLogic.Services.Users;
using ThePoemGame.BusinessLogic.Services.Games;
using ThePoemGame.BusinessLogic.Services.Poems;

namespace ThePoemGame.API
{
    public static class RegisterServices
    {
        public static void ConfigureServices(this WebApplicationBuilder builder)
        {
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSingleton<IDbConnection, DbConnection>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IGroupRepository, GroupRepository>();
            builder.Services.AddScoped<IGameRepository, GameRepository>();
            builder.Services.AddScoped<IPoemRepository, PoemRepository>();

            //builder.Services.AddTransient<DataSeeder>();

            builder.Services.AddScoped<IGroupService, GroupService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IClaimsService, ClaimsService>();
            builder.Services.AddScoped<IGameService, GameService>();
            builder.Services.AddScoped<IPoemService, PoemService>();

            builder.Services.AddControllers();
        }
    }
}