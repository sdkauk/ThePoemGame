using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ThePoemGame.BusinessLogic.Services.Games.Requests;
using ThePoemGame.Common.Models;
using ThePoemGame.DataAccess.Repositories;

namespace ThePoemGame.BusinessLogic.Services.Games
{
    public class GameService
    {
        private readonly IGameRepository gameRepository;
        private readonly IUserRepository userRepository;

        public GameService(IGameRepository gameRepository, IUserRepository userRepository)
        {
            this.gameRepository = gameRepository;
            this.userRepository = userRepository;
        }

        public async Task<Game> CreateGameAsync(GamePostRequest request, string userObjectId)
        {
            var user = new BasicUser(await userRepository.GetUserFromAuthenticationAsync(userObjectId));
            if (user == null)
            {
                throw new Exception("User not found");
            }
            var game = new Game
            {
                Id = Guid.NewGuid(),
                Name = "",
                Players = new List<BasicUser> { user },
                Poems = new List<BasicPoem>(),
                MaxPlayers = request.MaxPlayers,
                LinesPerPoem = request.LinesPerPoem
            };

            await gameRepository.CreateGameAsync(game);
            await userRepository.AddGameToUserAsync(user.Id, new BasicGame(game));

            return game;
        }
    }
}
