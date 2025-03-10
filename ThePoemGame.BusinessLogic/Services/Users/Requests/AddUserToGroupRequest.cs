using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.BusinessLogic.Services.Users.Requests
{
    public class AddUserToGroupRequest
    {
        public required string UserObjectId { get; set; }

        public required string InviteCode { get; set; }
    }
}
