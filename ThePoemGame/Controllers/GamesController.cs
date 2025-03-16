using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThePoemGame.BusinessLogic.Services.Claims;
using ThePoemGame.BusinessLogic.Services.Games;
using ThePoemGame.BusinessLogic.Services.Games.Requests;
using ThePoemGame.BusinessLogic.Services.Groups;
using ThePoemGame.BusinessLogic.Services.Poems;
using ThePoemGame.BusinessLogic.Services.Users;
using ThePoemGame.Common.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IUserService userService;
    private readonly IClaimsService claimsService;
    private readonly IGroupService groupService;
    private readonly IGameService gameService;

    public GamesController(IUserService userService, IClaimsService claimsService, IGroupService groupService, IGameService gameService)
    {
        this.userService = userService;
        this.claimsService = claimsService;
        this.groupService = groupService;
        this.gameService = gameService;
    }

    [HttpGet]
    [Route("user")]
    public async Task<IActionResult> GetGamesByUser()
    {
        string userObjectId = claimsService.GetObjectId(User);
        var games = await gameService.GetGamesByUserAsync(userObjectId);
        return Ok(games);
    }


    [HttpGet]
    [Route("group")]
    public async Task<IActionResult> GetGamesByGroup([FromQuery] Guid groupId)
    {
        var games = await gameService.GetGamesByGroupAsync(groupId);
        return Ok(games);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetGame(Guid id)
    {
        var game = await gameService.GetGameAsync(id);
        return Ok(game);
    }
    [HttpGet("{gameId}/participant")]
    public async Task<IActionResult> IsUserInGame(Guid gameId)
    {
        string userObjectId = claimsService.GetObjectId(User);
        bool isMember = await gameService.IsUserInGameAsync(gameId, userObjectId);
        return Ok(isMember);
    }
    [HttpPost]
    public async Task<IActionResult> CreateGame([FromBody] GamePostRequest request)
    {
        string userObjectId = claimsService.GetObjectId(User);
        var game = await gameService.CreateGameAsync(request, userObjectId);
        return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
    }

    [HttpPost("{gameId}/start")]
    public async Task<IActionResult> StartGame(Guid gameId)
    {
        var game = await gameService.StartGameAsync(gameId);
        return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
    }

}