using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.BusinessLogic.Services.Users.Requests
{
    public class AddUserToGameRequest
    {
        public required string UserObjectId { get; set; }
        public string? InviteCode { get; set; }
        public Guid? GameId { get; set; }

    }
}
