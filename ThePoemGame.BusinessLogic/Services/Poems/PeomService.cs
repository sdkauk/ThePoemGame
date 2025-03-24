using ThePoemGame.BusinessLogic.Services.Poems.Requests;
using ThePoemGame.BusinessLogic.Services.Poems.Responses;
using ThePoemGame.Common.Models;
using ThePoemGame.DataAccess.Repositories;

namespace ThePoemGame.BusinessLogic.Services.Poems
{
    public class PoemService : IPoemService
    {
        private readonly IPoemRepository poemRepository;
        private readonly IUserRepository userRepository;
        private readonly IGameRepository gameRepository;

        public PoemService(IPoemRepository poemRepository, IUserRepository userRepository, IGameRepository gameRepository)
        {
            this.poemRepository = poemRepository;
            this.userRepository = userRepository;
            this.gameRepository = gameRepository;
        }
        public async Task<Poem> GetPoemAsync(Guid id)
        {
            return await poemRepository.GetPoemAsync(id);
        }

        public async Task<List<WaitingPoemResponse>> GetPoemsWaitingForUserAsync(string userObjectId)
        {
            var user = await userRepository.GetUserFromAuthenticationAsync(userObjectId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            List<WaitingPoemResponse> waitingPoems = new List<WaitingPoemResponse>();

            var userGames = await gameRepository.GetGamesByUserAsync(user.Id);

            var gameMap = userGames.ToDictionary(g => g.Id, g => g);

            //TODO: add repo method for this
            foreach (var basicPoem in user.PoemsWaiting)
            {
                var poem = await poemRepository.GetPoemAsync(basicPoem.Id);
                if (poem != null)
                {
                    // Find which game this poem belongs to
                    var game = gameMap.Values.FirstOrDefault(g =>
                        g.Poems.Any(p => p.Id == poem.Id));

                    if (game != null)
                    {
                        waitingPoems.Add(new WaitingPoemResponse
                        {
                            PoemId = poem.Id,
                            Title = poem.Title,
                            Author = poem.Author,
                            LineCount = poem.Lines.Count,
                            GameId = game.Id,
                            GameName = game.Name
                        });
                    }
                }
            }

            return waitingPoems;
        }

        //TODO Add validation
        public async Task<Poem> CreatePoemAsync(PoemPostRequest request, string userObjectId)
        {
            var user = new BasicUser(await userRepository.GetUserFromAuthenticationAsync(userObjectId));
            if (user == null)
            {
                throw new Exception("User not found");
            }
            var firstLine = new Line
            {
                Id = Guid.NewGuid(),
                Author = user,
                Content = request.FirstLineContent,
                LineNumber = 1,
                Kudos = 0,
                LineType = LineType.Call
            };

            var poem = new Poem
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Author = user,
                Lines = [firstLine],
                CreatedAt = DateTime.UtcNow,
                PaperType = request.PaperType
            };

            await gameRepository.AddPoemToGame(request.GameId, new BasicPoem(poem));
            await poemRepository.CreatePoemAsync(poem);

            return poem;
        }

        //Add validation
        public async Task<Poem> AddLineToPoemAsync(LinePostRequest request, string userObjectId)
        {
            var user = new BasicUser(await userRepository.GetUserFromAuthenticationAsync(userObjectId));
            if (user == null)
            {
                throw new Exception("User not found");
            }
            var poem = await poemRepository.GetPoemAsync(request.PoemId);

            var lineNumber = poem.Lines.Count + 1;
            var previousLine = poem.Lines.LastOrDefault();
            var line = new Line
            {
                Id = Guid.NewGuid(),
                Author = user,
                Content = request.Content,
                LineNumber = lineNumber,
                Kudos = 0,
                LineType = previousLine?.LineType == LineType.Call ? LineType.Response : LineType.Call,
            };

            await poemRepository.AddLineToPoem(poem.Id, line);
            return poem;
        }
    }
}
