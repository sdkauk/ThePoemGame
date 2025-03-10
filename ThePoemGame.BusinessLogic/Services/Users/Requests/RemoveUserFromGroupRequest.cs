using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.BusinessLogic.Services.Users.Requests
{
    public class RemoveUserFromGroupRequest
    {
        public required string UserObjectId { get; set; }

        public required Guid GroupId { get; set; }
    }
}
