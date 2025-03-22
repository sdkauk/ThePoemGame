using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThePoemGame.BusinessLogic.Services.Claims;
using ThePoemGame.BusinessLogic.Services.Groups;
using ThePoemGame.BusinessLogic.Services.Users;
using ThePoemGame.BusinessLogic.Services.Users.Requests;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService userService;
    private readonly IClaimsService claimsService;
    private readonly IGroupService groupService;

    public UsersController(IUserService userService, IClaimsService claimsService, IGroupService groupService)
    {
        this.userService = userService;
        this.claimsService = claimsService;
        this.groupService = groupService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUser(string objectId)
    {
        var user = await userService.GetCurrentUserAsync(objectId);
        return Ok(user);
    }

    [HttpPost("group/join")]
    public async Task<IActionResult> JoinGroup(string inviteCode)
    {
        var userObjectId = claimsService.GetObjectId(User);
        var request = new AddUserToGroupRequest()
        {
            UserObjectId = userObjectId,
            InviteCode = inviteCode
        };
        var result = await userService.AddUserToGroupAsync(request);
        return Ok(result);
    }

    [HttpPost("group/leave")]
    public async Task<IActionResult> LeaveGroup(Guid groupId)
    {
        var userObjectId = claimsService.GetObjectId(User);
        var request = new RemoveUserFromGroupRequest()
        {
            UserObjectId = userObjectId,
            GroupId = groupId
        };
        var result = await userService.RemoveUserFromGroupAsync(request);
        return Ok(result);
    }

    [HttpPost("game/join/invite/{inviteCode}")]
    public async Task<IActionResult> JoinGameByInviteCode(string inviteCode)
    {
        var userObjectId = claimsService.GetObjectId(User);
        var request = new AddUserToGameRequest()
        {
            UserObjectId = userObjectId,
            InviteCode = inviteCode
        };
        var result = await userService.AddUserToGameAsync(request);
        return Ok(result);
    }

    [HttpPost("game/join/id/{gameId}")]
    public async Task<IActionResult> JoinGameById(Guid gameId)
    {
        var userObjectId = claimsService.GetObjectId(User);
        var request = new AddUserToGameRequest()
        {
            UserObjectId = userObjectId,
            GameId = gameId
        };
        var result = await userService.AddUserToGameAsync(request);
        return Ok(result);
    }

    [HttpPost("game/leave")]
    public async Task<IActionResult> LeaveGame(Guid gameId)
    {
        var userObjectId = claimsService.GetObjectId(User);
        var request = new RemoveUserFromGameRequest()
        {
            UserObjectId = userObjectId,
            GameId = gameId
        };
        var result = await userService.RemoveUserFromGameAsync(request);
        return Ok(result);
    }
}