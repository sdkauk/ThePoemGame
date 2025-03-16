using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThePoemGame.BusinessLogic.Services.Claims;
using ThePoemGame.BusinessLogic.Services.Games;
using ThePoemGame.BusinessLogic.Services.Games.Requests;
using ThePoemGame.BusinessLogic.Services.Groups;
using ThePoemGame.BusinessLogic.Services.Poems;
using ThePoemGame.BusinessLogic.Services.Poems.Requests;
using ThePoemGame.BusinessLogic.Services.Users;
using ThePoemGame.Common.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PoemsController : ControllerBase
{
    private readonly IUserService userService;
    private readonly IClaimsService claimsService;
    private readonly IGroupService groupService;
    private readonly IGameService gameService;
    private readonly IPoemService poemService;

    public PoemsController(IUserService userService, IClaimsService claimsService, IGroupService groupService, IGameService gameService, IPoemService poemService)
    {
        this.userService = userService;
        this.claimsService = claimsService;
        this.groupService = groupService;
        this.gameService = gameService;
        this.poemService = poemService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPoem(Guid id)
    {
        var poem = await poemService.GetPoemAsync(id);
        return Ok(poem);
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreatePoem([FromBody] PoemPostRequest request)
    {
        string userObjectId = claimsService.GetObjectId(User);
        var poem = await poemService.CreatePoemAsync(request, userObjectId);
        //TODO: Improve this whole vertical slice.
        var isRoundRobinPhase = await gameService.MoveToRoundRobinPhase(request.GameId);
        if (isRoundRobinPhase)
        {
            //TODO: update this to not get the game response?
            var allPoems = (await gameService.GetGameAsync(request.GameId, userObjectId)).Poems;
            foreach(BasicPoem gamePoem in allPoems)
            {
                await gameService.PassPoemToNextPlayer(gamePoem.Id, request.GameId, null, gamePoem.Author.Id);
            }
        }
        return CreatedAtAction(nameof(GetPoem), new { id = poem.Id }, poem);
    }

    [HttpPost]
    [Route("addLine")]
    public async Task<IActionResult> AddLineToPoem([FromBody] LinePostRequest request)
    {
        string userObjectId = claimsService.GetObjectId(User);
        await poemService.AddLineToPoemAsync(request, userObjectId);
        await gameService.PassPoemToNextPlayer(request.PoemId, request.GameId, userObjectId, null);
        return Created();
    }
}