using ThePoemGame.BusinessLogic.Services.Claims;
using ThePoemGame.BusinessLogic.Services.Users;
using ThePoemGame.BusinessLogic.Services.Users.Requests;

public class UserSynchronizationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserSynchronizationMiddleware> _logger;

    public UserSynchronizationMiddleware(RequestDelegate next, ILogger<UserSynchronizationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IUserService userService, IClaimsService claimsService)
    {
        _logger.LogInformation("Middleware executing. Is authenticated: {IsAuthenticated}",
            context.User.Identity?.IsAuthenticated);

        if (context.User.Identity?.IsAuthenticated == true)
        {
            var objectId = claimsService.GetObjectId(context.User);
            _logger.LogInformation("User authenticated. Object ID: {ObjectId}", objectId);

            if (!string.IsNullOrEmpty(objectId))
            {
                try
                {
                    var user = await userService.GetCurrentUserAsync(objectId);

                    if (user == null)
                    {
                        _logger.LogInformation("Creating new user for Object ID: {ObjectId}", objectId);
                        // User doesn't exist, create a new one using the existing method
                        var email = claimsService.GetEmail(context.User);
                        var displayName = claimsService.GetDisplayName(context.User);

                        _logger.LogInformation("User details - Email: {Email}, Name: {DisplayName}",
                            email, displayName);

                        var request = new UserPostRequest
                        {
                            ObjectIdentifier = objectId,
                            Email = email ?? "no-email@example.com", // Fallback if null
                            DisplayName = displayName ?? "Unknown User", // Fallback if null
                        };

                        await userService.CreateUserAsync(request);
                        _logger.LogInformation("User created successfully");
                    }
                    else
                    {
                        _logger.LogInformation("Existing user found with ID: {UserId}", user.Id);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in user synchronization for Object ID: {ObjectId}", objectId);
                }
            }
            else
            {
                _logger.LogWarning("Authenticated user has no Object ID claim");
                // Log all claims to help diagnose the issue
                foreach (var claim in context.User.Claims)
                {
                    _logger.LogInformation("Claim: {Type} = {Value}", claim.Type, claim.Value);
                }
            }
        }
        else
        {
            _logger.LogInformation("User not authenticated");
        }

        await _next(context);
    }
}