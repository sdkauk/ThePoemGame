using System.Security.Claims;

namespace ThePoemGame.BusinessLogic.Services.Claims
{
    public class ClaimsService : IClaimsService
    {
        private const string ObjectIdClaimType = "http://schemas.microsoft.com/identity/claims/objectidentifier";
        private const string EmailClaimType = "emails";
        private const string DisplayNameClaimType = "name";

        public string GetObjectId(ClaimsPrincipal user)
        {
            return user.FindFirst(ObjectIdClaimType)?.Value;
        }

        public string GetEmail(ClaimsPrincipal user)
        {
            return user.FindFirst(EmailClaimType)?.Value;
        }

        public string GetDisplayName(ClaimsPrincipal user)
        {
            return user.FindFirst(DisplayNameClaimType)?.Value;
        }
    }
}