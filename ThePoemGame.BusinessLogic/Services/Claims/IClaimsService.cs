using System.Security.Claims;

namespace ThePoemGame.BusinessLogic.Services.Claims
{
    public interface IClaimsService
    {
        string GetDisplayName(ClaimsPrincipal user);
        string GetEmail(ClaimsPrincipal user);
        string GetObjectId(ClaimsPrincipal user);
    }
}