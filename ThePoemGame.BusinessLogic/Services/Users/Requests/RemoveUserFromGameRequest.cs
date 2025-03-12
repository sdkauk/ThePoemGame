using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.BusinessLogic.Services.Users.Requests
{
    public class RemoveUserFromGameRequest
    {
        public required string UserObjectId { get; set; }
        public required Guid GameId { get; set; }

    }
}
