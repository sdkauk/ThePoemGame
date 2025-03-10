using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThePoemGame.BusinessLogic.Services.Users.Requests
{
    public class UserPostRequest
    {
        public string ObjectIdentifier { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
    }

}
