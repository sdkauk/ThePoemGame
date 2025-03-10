using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ThePoemGame.BusinessLogic.Services.Claims;
using ThePoemGame.BusinessLogic.Services.Groups;
using ThePoemGame.BusinessLogic.Services.Users;
using ThePoemGame.Common.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly IUserService userService;
    private readonly IClaimsService claimsService;
    private readonly IGroupService groupService;

    public GroupsController(IUserService userService, IClaimsService claimsService, IGroupService groupService)
    {
        this.userService = userService;
        this.claimsService = claimsService;
        this.groupService = groupService;
    }

    [HttpGet]
    public async Task<IActionResult> GetGroupsByUser()
    {
        string userObjectId = claimsService.GetObjectId(User);
        var groups = await groupService.GetGroupsByUserAsync(userObjectId);
        return Ok(groups);
    }

    [HttpGet]
    public async Task<IActionResult> GetGroups(Guid id)
    {
        var users = await groupService.GetGroupAsync(id);
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGroup(string name)
    {
        string userObjectId = claimsService.GetObjectId(User);
        var group = await groupService.CreateGroupAsync(name,userObjectId);
        return CreatedAtAction(nameof(Group), new {id = group.Id}, group);
    }
}