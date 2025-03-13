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
    public class GameService : IGameService
    {
        private readonly IGameRepository gameRepository;
        private readonly IUserRepository userRepository;
        private readonly IPoemRepository poemRepository;

        public GameService(IGameRepository gameRepository, IUserRepository userRepository, IPoemRepository poemRepository)
        {
            this.gameRepository = gameRepository;
            this.userRepository = userRepository;
            this.poemRepository = poemRepository;
        }
        public async Task<List<Game>> GetGamesByUserAsync(string userObjectId)
        {
            var user = await userRepository.GetUserFromAuthenticationAsync(userObjectId);
            return await gameRepository.GetGamesByUserAsync(user.Id);
        }

        public async Task<Game> GetGameAsync(Guid id)
        {
            return await gameRepository.GetGameAsync(id);
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
                LinesPerPoem = request.LinesPerPoem,
                Status = GameStatus.WaitingForPlayers,
            };

            await gameRepository.CreateGameAsync(game);
            await userRepository.AddGameToUserAsync(user.Id, new BasicGame(game));

            return game;
        }

        public async Task<Game> StartGameAsync(Guid gameId)
        {
            var game = await gameRepository.GetGameAsync(gameId);
            if (game == null)
            {
                throw new ArgumentException($"Game with ID {gameId} not found", nameof(gameId));
            }

            game.Status = GameStatus.InProgress;
            game.Phase = GamePhase.CreatePoems;

            if (game.Players != null && game.Players.Any())
            {
                var random = new Random();
                game.Players = game.Players.OrderBy(x => random.Next()).ToList();
                game.PlayerOrder = game.Players;
            }

            await gameRepository.UpdateGameAsync(game);

            return game;
        }

        public async Task<bool> MoveToRoundRobinPhase(Guid gameId)
        {
            var game = await gameRepository.GetGameAsync(gameId);
            if (game == null)
            {
                throw new ArgumentException($"Game with ID {gameId} not found", nameof(gameId));
            }
            if (game.Phase != GamePhase.CreatePoems)
            {
                return false;
            }

            if (game.Poems.Count < game.Players.Count) //A quick and dirty check to make sure all players have submitted a poem.
            {
                return false;
            }
            game.Phase = GamePhase.RoundRobin;
            await gameRepository.UpdateGameAsync(game);

            return true;
        }

        //TODO: clean this up somehow to use less db calls. might require some restructuring
        public async Task PassPoemToNextPlayer(Guid poemId, Guid gameId, string? userObjectId, Guid? userId)
        {
            if (string.IsNullOrEmpty(userObjectId) && (!userId.HasValue || userId.Value == Guid.Empty))
            {
                throw new Exception("Either userObjectId or userId must be provided");
            }
            var user = default(User);
            if (!string.IsNullOrEmpty(userObjectId))
            { 
                user = await userRepository.GetUserFromAuthenticationAsync(userObjectId); 
            }
            else
            {
                user = await userRepository.GetUserAsync(userId!.Value); 
            }
            var poem = await poemRepository.GetPoemAsync(poemId);
            var game = await gameRepository.GetGameAsync(gameId);
            var gamePoem = game.Poems.FirstOrDefault(p => p.Id == poem.Id);
            if (gamePoem == null)
            {
                throw new Exception("Game poem was null.");
            }

            //nextPlayer is the next player in the player order after our user
            var nextPlayer = game.PlayerOrder
                .SkipWhile(p => p.Id != user.Id)
                .Skip(1)
                .FirstOrDefault() ?? game.PlayerOrder.FirstOrDefault();

            if (nextPlayer == null)
            {
                throw new Exception("We could not find the next player");
            }

            poem.NextContributor = nextPlayer;
            gamePoem.NextContributor = nextPlayer;

            //Make this a repository method?
            var poemToRemove = user.PoemsWaiting.FirstOrDefault(p => p.Id == poem.Id);
            if (poemToRemove != null)
            {
                user.PoemsWaiting.Remove(poemToRemove);
            }

            var nextPlayerUser = await userRepository.GetUserAsync(nextPlayer.Id);
            nextPlayerUser.PoemsWaiting.Add(new BasicPoem(poem));

            //Set poem to completed if the poem has the right number of lines.
            if (poem.Lines.Count == game.LinesPerPoem)
            {
                poem.Completed = true;
                gamePoem.Completed = true;
            }

            //if all the poems in the game are completed, move to the exhibit phase of the game
            bool allPoemsFinished = game.Poems.All(p => p.Completed);
            if (allPoemsFinished)
            {
                game.Phase = GamePhase.Exhibit;
            }

            await userRepository.UpdateUserAsync(user);
            await userRepository.UpdateUserAsync(nextPlayerUser);
            await poemRepository.UpdatePoemAsync(poem);
            await gameRepository.UpdateGameAsync(game);
        } 
    }
}
