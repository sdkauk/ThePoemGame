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

    [HttpPost("join")]
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

    [HttpPost("leave")] //Should this be post or put?
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
}